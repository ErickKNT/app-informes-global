import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import {
  X,
  CalendarCheck2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export interface MonthClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonthName: string;
  nextMonthName: string;
  currentYear: number;
  reportedCount: number;
  totalPublishers: number;
  onConfirmCloseMonth: () => void;
}

export const MonthClosingModal: React.FC<MonthClosingModalProps> = ({
  isOpen,
  onClose,
  currentMonthName,
  nextMonthName,
  currentYear,
  reportedCount,
  totalPublishers,
  onConfirmCloseMonth,
}) => {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  if (!isOpen) return null;

  const canConfirm = check1 && check2 && check3;
  const pendingCount = Math.max(0, totalPublishers - reportedCount);

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsProcessing(false);
    onConfirmCloseMonth();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="month-closing-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="flex min-h-full items-start sm:items-center justify-center py-2 sm:py-6 pointer-events-none">
        <div
          className={cn(
            'bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl',
            'w-full max-w-xl max-h-[calc(100dvh-2.5rem)] overflow-hidden flex flex-col pointer-events-auto min-h-0'
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 bg-surface-container-low border-b border-surface-container-high/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary-container/60 text-secondary flex items-center justify-center shadow-xs shrink-0">
                <CalendarCheck2 className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex flex-col">
                <h2 id="month-closing-title" className="font-headline text-base font-bold text-on-surface">
                  Cierre Oficial del Ciclo Mensual
                </h2>
                <span className="text-xs text-on-surface-variant font-medium">
                  Transición teocrática de informes y archivo
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 flex flex-col gap-5 overscroll-contain">
          {/* Banner de Transición de Mes */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                Mes que se cierra
              </span>
              <span className="font-headline text-base font-extrabold text-on-surface">
                {currentMonthName} {currentYear}
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-outline" />

            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                Siguiente mes activo
              </span>
              <span className="font-headline text-base font-extrabold text-secondary">
                {nextMonthName} {currentYear}
              </span>
            </div>
          </div>

          {/* Advertencia si hay pendientes */}
          {pendingCount > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Hay {pendingCount} publicadores con informe pendiente
                </span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Al cerrar el mes, los publicadores sin informe serán marcados como no informantes para efectos de la tarjeta S-21. Puedes registrar sus informes más tarde en modo asistido si es necesario.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  ¡100% de informes recibidos!
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Todos los publicadores activos entregaron su informe a tiempo.
                </span>
              </div>
            </div>
          )}

          {/* Checklist de Verificación Obligatoria */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-on-surface">
              Puntos de Verificación del Secretario:
            </span>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/80 cursor-pointer hover:border-secondary transition-colors select-none">
              <input
                type="checkbox"
                checked={check1}
                onChange={(e) => setCheck1(e.target.checked)}
                className="mt-0.5 rounded border-outline text-secondary focus:ring-secondary/40 w-4 h-4 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Copia de respaldo enviada o guardada
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Se ha generado y copiado el resumen para jw.org / Sucursal.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/80 cursor-pointer hover:border-secondary transition-colors select-none">
              <input
                type="checkbox"
                checked={check2}
                onChange={(e) => setCheck2(e.target.checked)}
                className="mt-0.5 rounded border-outline text-secondary focus:ring-secondary/40 w-4 h-4 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Revisión con los encargados de grupo completada
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Se coordinó la recepción de todos los informes posibles de los 5 grupos.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/80 cursor-pointer hover:border-secondary transition-colors select-none">
              <input
                type="checkbox"
                checked={check3}
                onChange={(e) => setCheck3(e.target.checked)}
                className="mt-0.5 rounded border-outline text-secondary focus:ring-secondary/40 w-4 h-4 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Validación de horas de precursores
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Se verificaron los totales de precursores regulares y auxiliares para su archivo S-21.
                </span>
              </div>
            </label>
          </div>

          {/* Nota de seguridad */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high text-[11px] text-outline">
            <ShieldAlert className="w-4 h-4 text-secondary shrink-0" />
            <span>
              Los informes cerrados quedan protegidos contra modificaciones no autorizadas y quedan respaldados en el archivo histórico.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!canConfirm || isProcessing}
            onClick={handleConfirm}
            className="text-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Cerrando mes...' : 'Confirmar Cierre de Mes'}</span>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

MonthClosingModal.displayName = 'MonthClosingModal';
