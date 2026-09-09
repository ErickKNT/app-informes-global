import React, { useState } from 'react';
import {
  FileText,
  Download,
  RefreshCw,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { ConsolidatedMetricsSummary } from '@/components/organisms/ConsolidatedMetricsSummary';
import { HistoricalComparativeChart } from '@/components/organisms/HistoricalComparativeChart';
import { S21ConsolidatedTable } from '@/components/organisms/S21ConsolidatedTable';
import { RegularPioneersGoalCard } from '@/components/organisms/RegularPioneersGoalCard';

export interface ConsolidatedReportsPageProps {
  onExportPdf?: () => void;
  onExportS21?: () => void;
}

export const ConsolidatedReportsPage: React.FC<ConsolidatedReportsPageProps> = ({
  onExportPdf,
  onExportS21,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-2025');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const handleExportSummary = async () => {
    setIsExporting(true);
    try {
      if (onExportPdf) {
        await onExportPdf();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
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
        await new Promise((resolve) => setTimeout(resolve, 600));
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
              <label
                htmlFor="period-select"
                className="text-xs text-on-surface-variant font-medium"
              >
                Período:
              </label>
              <div className="relative">
                <select
                  id="period-select"
                  aria-label="Seleccionar período"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-surface-container-lowest text-xs text-on-surface font-semibold rounded-lg pl-3 pr-8 py-1.5 border border-surface-container-high shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="2024-2025">Año de Servicio 2024-2025</option>
                  <option value="2024-10">Octubre 2024 (Mes activo)</option>
                  <option value="2024-09">Septiembre 2024</option>
                  <option value="2023-2024">Año de Servicio 2023-2024</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="category-select"
                className="text-xs text-on-surface-variant font-medium"
              >
                Categoría:
              </label>
              <div className="relative">
                <select
                  id="category-select"
                  aria-label="Seleccionar categoría"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface-container-lowest text-xs text-on-surface font-semibold rounded-lg pl-3 pr-8 py-1.5 border border-surface-container-high shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="all">Toda la Congregación</option>
                  <option value="regular_pioneers">Solo Precursores Regulares</option>
                  <option value="auxiliary_pioneers">Solo Precursores Auxiliares</option>
                  <option value="publishers">Solo Publicadores</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
              </div>
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
    </div>
  );
};

ConsolidatedReportsPage.displayName = 'ConsolidatedReportsPage';
