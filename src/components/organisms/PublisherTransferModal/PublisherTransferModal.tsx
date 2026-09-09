import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="flex min-h-full items-start sm:items-center justify-center py-2 sm:py-6 pointer-events-none">
        <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md max-h-[calc(100dvh-2.5rem)] border border-surface-container-high shadow-2xl flex flex-col min-h-0 overflow-hidden pointer-events-auto">
          {/* Header Fijo */}
          <div className="flex-shrink-0 px-6 py-4 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
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
              className="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form con scroll y footer fijo */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="p-5 sm:p-6 pb-8 overflow-y-auto flex-1 min-h-0 flex flex-col gap-4 overscroll-contain">
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
                <Select
                  id="target-group-select"
                  ariaLabel="Seleccionar grupo destino"
                  value={selectedGroupId}
                  onChange={(val) => setSelectedGroupId(val)}
                  disabled={isLoading}
                  options={availableGroups.map((grp) => ({
                    value: grp.id,
                    label: `${grp.name} ${grp.id === publisher.service_group_id ? '(Actual)' : ''}`.trim(),
                  }))}
                />
              </div>
            </div>

            {/* Actions Fijas en Footer */}
            <div className="flex-shrink-0 px-6 py-3.5 bg-surface-container-low/60 border-t border-surface-container-high/60 flex items-center justify-end gap-2.5">
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
    </div>
  );
};

PublisherTransferModal.displayName = 'PublisherTransferModal';
