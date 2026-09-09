import React, { useState } from 'react';
import {
  FileText,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { ConsolidatedMetricsSummary } from '@/components/organisms/ConsolidatedMetricsSummary';
import { HistoricalComparativeChart } from '@/components/organisms/HistoricalComparativeChart';
import { S21ConsolidatedTable } from '@/components/organisms/S21ConsolidatedTable';
import { RegularPioneersGoalCard } from '@/components/organisms/RegularPioneersGoalCard';
import {
  BranchReportSummaryModal,
  type BranchReportData,
} from '@/components/organisms/BranchReportSummaryModal';
import { exportService } from '@/services/exportService';

export interface ConsolidatedReportsPageProps {
  onExportPdf?: () => void;
  onExportS21?: () => void;
}

const DEFAULT_BRANCH_DATA: BranchReportData = {
  congregationName: 'Congregación El Olivar',
  monthName: 'Octubre',
  year: 2024,
  totalPublishers: 98,
  reportedPublishers: 84,
  totalBibleStudies: 42,
  regularPioneersCount: 16,
  regularPioneersHours: 820,
  auxiliaryPioneersCount: 12,
  auxiliaryPioneersHours: 374,
  midweekMeetingAverage: 88,
  weekendMeetingAverage: 104,
};

export const ConsolidatedReportsPage: React.FC<ConsolidatedReportsPageProps> = ({
  onExportPdf,
  onExportS21,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-2025');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const handleExportSummary = async () => {
    setIsExporting(true);
    try {
      if (onExportPdf) {
        await onExportPdf();
      } else {
        exportService.exportConsolidatedReportsCsv(selectedPeriod, [
          {
            id: 'grp-1',
            name: 'Grupo 1 - Los Olivos',
            groupNumber: 1,
            totalPublishers: 14,
            submittedReports: 14,
            hoursTotal: 184,
            bibleStudiesTotal: 12,
          },
          {
            id: 'grp-2',
            name: 'Grupo 2 - Betel',
            groupNumber: 2,
            totalPublishers: 16,
            submittedReports: 15,
            hoursTotal: 215,
            bibleStudiesTotal: 14,
          },
          {
            id: 'grp-3',
            name: 'Grupo 3 - Sinaí',
            groupNumber: 3,
            totalPublishers: 12,
            submittedReports: 12,
            hoursTotal: 160,
            bibleStudiesTotal: 9,
          },
        ]);
      }
      setExportSuccessMessage('Resumen Mensual generado con éxito en formato PDF/Excel.');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportS21Action = async () => {
    setIsExporting(true);
    try {
      if (onExportS21) {
        await onExportS21();
      } else {
        exportService.triggerPrint();
      }
      setExportSuccessMessage('Registro canónico S-21-S exportado exitosamente.');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Export Actions Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Secretaría Teocrática · Archivo S-21</span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              Reportes y Análisis de Servicio
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Consolidación canónica, avance del año de servicio y métricas de desempeño ministerial.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSummary}
              disabled={isExporting}
              className="text-xs"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>Resumen Mensual (PDF/Excel)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBranchModalOpen(true)}
              className="text-xs flex items-center gap-1.5 border-emerald-600/40 text-emerald-700 hover:bg-emerald-500/10"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Informe para Sucursal</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportS21Action}
              disabled={isExporting}
              className="text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Registro S-21</span>
            </Button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-surface-container-high/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Período:</span>
              <Select
                id="period-select"
                aria-label="Seleccionar período"
                value={selectedPeriod}
                onChange={(val) => setSelectedPeriod(val)}
                options={[
                  { value: '2024-2025', label: 'Año de Servicio 2024-2025' },
                  { value: '2024-10', label: 'Octubre 2024 (Mes activo)' },
                  { value: '2024-09', label: 'Septiembre 2024' },
                  { value: '2023-2024', label: 'Año de Servicio 2023-2024' },
                ]}
              />
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Categoría:</span>
              <Select
                id="category-select"
                aria-label="Seleccionar categoría"
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                options={[
                  { value: 'all', label: 'Toda la Congregación' },
                  { value: 'regular_pioneers', label: 'Solo Precursores Regulares' },
                  { value: 'auxiliary_pioneers', label: 'Solo Precursores Auxiliares' },
                  { value: 'publishers', label: 'Solo Publicadores' },
                ]}
              />
            </div>
          </div>

          {/* Reconciliation Status */}
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
            <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            <span>Última reconciliación: 28 Octubre 2024 · 21:15</span>
          </div>
        </div>
      </div>

      {/* Export Success Notification */}
      {exportSuccessMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-secondary-container/60 text-on-secondary-container text-xs font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {/* 3 Metric Highlight Cards */}
      <ConsolidatedMetricsSummary />

      {/* Historical Dynamic Chart */}
      <HistoricalComparativeChart />

      {/* Official S-21 Consolidated Table */}
      <S21ConsolidatedTable />

      {/* Regular Pioneers 600h Annual Goal Analysis */}
      <RegularPioneersGoalCard />

      {/* Modal de Informe para la Sucursal */}
      <BranchReportSummaryModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        data={DEFAULT_BRANCH_DATA}
      />
    </div>
  );
};

ConsolidatedReportsPage.displayName = 'ConsolidatedReportsPage';

