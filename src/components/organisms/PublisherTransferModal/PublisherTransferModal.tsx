import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import type { Profile, ServiceGroup } from '@/types/database.types';
import { ArrowRightLeft, X, CheckCircle2 } from 'lucide-react';

export interface PublisherTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (publisherId: string, newGroupId: string) => Promise<void> | void;
  publisher?: Profile | null;
  availableGroups?: ServiceGroup[];
  isLoading?: boolean;
}

export const PublisherTransferModal: React.FC<PublisherTransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  publisher,
  availableGroups = [],
  isLoading = false,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (publisher && availableGroups.length > 0) {
      // Por defecto seleccionar el primer grupo diferente al actual
      const otherGroup = availableGroups.find((g) => g.id !== publisher.service_group_id);
      setSelectedGroupId(otherGroup ? otherGroup.id : availableGroups[0]?.id || '');
    }
    setError(null);
  }, [publisher, availableGroups, isOpen]);

  if (!isOpen || !publisher) return null;

  const currentGroup = availableGroups.find((g) => g.id === publisher.service_group_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) {
      setError('Debes seleccionar un grupo de destino.');
      return;
    }

    try {
      await onTransfer(publisher.id, selectedGroupId);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al transferir publicador';
      setError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md border border-surface-container-high shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h2
              id="transfer-modal-title"
              className="font-headline text-base font-bold text-on-surface"
            >
              Transferir a Otro Grupo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-1 text-xs">
            <span className="text-outline uppercase text-[10px] font-bold">Publicador</span>
            <span className="text-sm font-bold text-on-surface">{publisher.full_name}</span>
            <span className="text-on-surface-variant">
              Grupo actual:{' '}
              <strong className="text-primary">{currentGroup ? currentGroup.name : 'Sin grupo'}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="target-group-select"
              className="text-xs font-semibold text-on-surface"
            >
              Seleccionar Grupo Destino:
            </label>
            <select
              id="target-group-select"
              aria-label="Seleccionar grupo destino"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={isLoading}
              className="bg-surface-container-lowest text-xs text-on-surface font-semibold rounded-xl p-3 border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {availableGroups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name} {grp.id === publisher.service_group_id ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-high/60 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar Transferencia</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

PublisherTransferModal.displayName = 'PublisherTransferModal';

