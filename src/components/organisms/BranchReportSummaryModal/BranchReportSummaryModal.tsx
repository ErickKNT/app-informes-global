import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import {
  X,
  Building2,
  Copy,
  Check,
  Printer,
  FileSpreadsheet,
  Users,
  BookOpen,
  Clock,
  ClipboardList,
} from 'lucide-react';

export interface BranchReportData {
  congregationName?: string;
  monthName: string;
  year: number;
  totalPublishers: number;
  reportedPublishers: number;
  totalBibleStudies: number;
  regularPioneersCount: number;
  regularPioneersHours: number;
  auxiliaryPioneersCount: number;
  auxiliaryPioneersHours: number;
  midweekMeetingAverage: number;
  weekendMeetingAverage: number;
}

export interface BranchReportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BranchReportData;
}

export const BranchReportSummaryModal: React.FC<BranchReportSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isCopied, setIsCopied] = useState(false);

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

  const reportingPercentage = data.totalPublishers > 0
    ? Math.round((data.reportedPublishers / data.totalPublishers) * 100)
    : 0;

  const summaryText =
    `INFORME MENSUAL DE LA CONGREGACIÓN - SUCURSAL\n` +
    `Congregación: ${data.congregationName || 'Congregación El Olivar'}\n` +
    `Mes y Año: ${data.monthName} ${data.year}\n` +
    `--------------------------------------------------\n` +
    `1. ACTIVIDAD GENERAL DE LA CONGREGACIÓN\n` +
    `• Publicadores activos en archivo: ${data.totalPublishers}\n` +
    `• Publicadores que informaron actividad: ${data.reportedPublishers} (${reportingPercentage}%)\n` +
    `• Cursos bíblicos totales conducidos: ${data.totalBibleStudies}\n\n` +
    `2. PRECURSORES REGULARES\n` +
    `• Total de precursores regulares informando: ${data.regularPioneersCount}\n` +
    `• Total de horas: ${data.regularPioneersHours} hrs (Promedio: ${data.regularPioneersCount > 0 ? (data.regularPioneersHours / data.regularPioneersCount).toFixed(1) : 0} hrs)\n\n` +
    `3. PRECURSORES AUXILIARES\n` +
    `• Total de precursores auxiliares informando: ${data.auxiliaryPioneersCount}\n` +
    `• Total de horas: ${data.auxiliaryPioneersHours} hrs (Promedio: ${data.auxiliaryPioneersCount > 0 ? (data.auxiliaryPioneersHours / data.auxiliaryPioneersCount).toFixed(1) : 0} hrs)\n\n` +
    `4. ASISTENCIA PROMEDIO A LAS REUNIONES\n` +
    `• Reunión de Entre Semana (Vida y Ministerio): ${data.midweekMeetingAverage} asistentes\n` +
    `• Reunión de Fin de Semana (Discurso y Atalaya): ${data.weekendMeetingAverage} asistentes\n` +
    `--------------------------------------------------\n` +
    `Generado oficialmente por el Portal Teocrático Congregacional.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="flex min-h-full items-start sm:items-center justify-center py-2 sm:py-6 pointer-events-none">
        <div
          className={cn(
            'bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl',
            'w-full max-w-2xl max-h-[calc(100dvh-2.5rem)] overflow-hidden flex flex-col pointer-events-auto min-h-0'
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 bg-surface-container-low border-b border-surface-container-high/80 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-primary-fixed" />
              </div>
              <div className="flex flex-col">
                <h2 id="branch-modal-title" className="font-headline text-base font-bold text-on-surface">
                  Informe Mensual para la Sucursal
                </h2>
                <span className="text-xs text-on-surface-variant font-medium">
                  {data.congregationName || 'Congregación El Olivar'} · {data.monthName} {data.year}
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

          {/* Cuerpo formal imprimible con scroll */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 flex flex-col gap-5 print:p-0 overscroll-contain">
          {/* Membrete teocrático */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-headline text-sm font-bold text-primary">
                  {data.congregationName || 'Congregación El Olivar'}
                </span>
                <span className="text-xs text-on-surface-variant">
                  Corte Mensual Oficial · Período: {data.monthName} {data.year}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container text-xs font-bold">
                {reportingPercentage}% Informaron
              </span>
            </div>
          </div>

          {/* Grid de 4 Bloques Canónicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Publicadores & Participación */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Users className="w-4 h-4 text-primary" />
                <span>Publicadores y Participación</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-on-surface-variant">Informaron actividad:</span>
                <span className="text-sm font-bold text-on-surface">
                  {data.reportedPublishers} / {data.totalPublishers}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-surface-container-high/40 pt-1">
                <span className="text-xs text-on-surface-variant">Porcentaje de entrega:</span>
                <span className="text-xs font-bold text-secondary">{reportingPercentage}%</span>
              </div>
            </div>

            {/* 2. Cursos Bíblicos */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Cursos Bíblicos</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-on-surface-variant">Total conducidos:</span>
                <span className="text-base font-extrabold text-primary">{data.totalBibleStudies}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-surface-container-high/40 pt-1">
                <span className="text-xs text-on-surface-variant">Promedio por publicador:</span>
                <span className="text-xs font-semibold text-outline">
                  {data.reportedPublishers > 0 ? (data.totalBibleStudies / data.reportedPublishers).toFixed(2) : 0}
                </span>
              </div>
            </div>

            {/* 3. Precursores Regulares y Auxiliares */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Clock className="w-4 h-4 text-primary" />
                <span>Horas de Precursores</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-on-surface-variant">P. Regulares ({data.regularPioneersCount}):</span>
                <span className="text-xs font-bold text-on-surface">{data.regularPioneersHours} hrs</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-surface-container-high/40 pt-1">
                <span className="text-xs text-on-surface-variant">P. Auxiliares ({data.auxiliaryPioneersCount}):</span>
                <span className="text-xs font-bold text-on-surface">{data.auxiliaryPioneersHours} hrs</span>
              </div>
            </div>

            {/* 4. Promedios de Asistencia */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <ClipboardList className="w-4 h-4 text-primary" />
                <span>Promedio Asistencia a Reuniones</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-on-surface-variant">Entre semana (VMC):</span>
                <span className="text-xs font-bold text-on-surface">{data.midweekMeetingAverage}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-surface-container-high/40 pt-1">
                <span className="text-xs text-on-surface-variant">Fin de semana:</span>
                <span className="text-xs font-bold text-on-surface">{data.weekendMeetingAverage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="flex-shrink-0 p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between no-print">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Formato</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleCopy}
              className={cn(
                'text-xs flex items-center gap-1.5',
                isCopied && 'bg-emerald-600 hover:bg-emerald-700 text-white'
              )}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? '¡Copiado para jw.org!' : 'Copiar Resumen para Sucursal'}</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

BranchReportSummaryModal.displayName = 'BranchReportSummaryModal';

