import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import type { ServiceGroup } from '@/types/database.types';
import { AlertTriangle, X, ArrowRightLeft, Trash2 } from 'lucide-react';

export interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (groupId: string, fallbackGroupId?: string) => Promise<void> | void;
  group?: ServiceGroup | null;
  publishersCount?: number;
  otherGroups?: ServiceGroup[];
  isLoading?: boolean;
}

export const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  group,
  publishersCount = 0,
  otherGroups = [],
  isLoading = false,
}) => {
  const [fallbackGroupId, setFallbackGroupId] = useState<string>('');
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
    if (otherGroups.length > 0) {
      setFallbackGroupId(otherGroups[0]?.id || '');
    }
    setError(null);
  }, [otherGroups, isOpen]);

  if (!isOpen || !group) return null;

  const hasPublishers = publishersCount > 0;

  const handleDelete = async () => {
    if (hasPublishers && !fallbackGroupId) {
      setError('Debes seleccionar un grupo de respaldo para transferir a los publicadores.');
      return;
    }

    try {
      await onConfirmDelete(group.id, fallbackGroupId || undefined);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar el grupo';
      setError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-group-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md max-h-[calc(100dvh-2rem)] border border-surface-container-high shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-error-container/30 border-b border-error-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-error text-on-error flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2
              id="delete-group-title"
              className="font-headline text-base font-bold text-on-surface"
            >
              Eliminar Grupo de Servicio
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

        {/* Content con Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 overscroll-contain">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
              {error}
            </div>
          )}

          <p className="text-xs text-on-surface-variant leading-relaxed">
            ¿Estás seguro de que deseas eliminar el{' '}
            <strong className="text-on-surface">{group.name}</strong>? Esta acción no se
            puede deshacer.
          </p>

          {hasPublishers ? (
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <ArrowRightLeft className="w-4 h-4" />
                <span>
                  Este grupo tiene {publishersCount} publicador(es) asignado(s)
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Selecciona el grupo receptor al que serán transferidos automáticamente todos
                los publicadores:
              </p>

              <Select
                ariaLabel="Grupo receptor para publicadores"
                value={fallbackGroupId}
                onChange={(val) => setFallbackGroupId(val)}
                disabled={isLoading}
                options={otherGroups.map((grp) => ({
                  value: grp.id,
                  label: grp.name,
                }))}
              />
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-outline font-medium">
              Este grupo no tiene publicadores asignados actualmente.
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-high/60 mt-auto">
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
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isLoading}
              className="text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Grupo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteGroupModal.displayName = 'DeleteGroupModal';
