import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ReportSubmissionForm } from '@/components/organisms/ReportSubmissionForm';
import type { MonthlyReportFormData } from '@/schemas/monthlyReportSchema';
import type { PublisherListItem } from '@/components/organisms/PublishersTable';
import { X, UserCheck } from 'lucide-react';

export interface AssistedReportModalProps {
  publisher: PublisherListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (publisherId: string, data: MonthlyReportFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AssistedReportModal: React.FC<AssistedReportModalProps> = ({
  publisher,
  isOpen,
  onClose,
  onSubmitReport,
  isSubmitting = false,
}) => {
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

  if (!isOpen || !publisher) return null;

  const handleSubmit = async (data: MonthlyReportFormData) => {
    await onSubmitReport(publisher.id, data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200"
    >
      <div
        className={cn(
          'bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl',
          'w-full max-w-lg max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden my-auto'
        )}
      >
        {/* Header del Modal */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 bg-surface-container-low border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-primary-fixed" />
            </div>
            <div className="flex flex-col">
              <span id="modal-title" className="font-headline text-base font-bold text-on-surface">
                Registrar Informe Asistido
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Publicador: <strong className="text-primary">{publisher.name}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Formulario con scroll vertical */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          <ReportSubmissionForm
            role={publisher.privilege}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            className="border-0 p-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
};

AssistedReportModal.displayName = 'AssistedReportModal';
