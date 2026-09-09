import React from 'react';
import { UserCheck, Clock, BookOpen, TrendingUp, ArrowUp } from 'lucide-react';

export interface MetricHighlightData {
  averagePublishers: number;
  publishersTrendPct: number;
  totalPublishers: number;
  totalHours: number;
  averageHoursPerPublisher: number;
  projectedAnnualHours: number;
  averageBibleStudies: number;
  studiesDiffFromLastMonth: number;
  studiesRatio: number;
}

export interface ConsolidatedMetricsSummaryProps {
  data?: MetricHighlightData;
}

const DEFAULT_METRICS: MetricHighlightData = {
  averagePublishers: 94.2,
  publishersTrendPct: 1.8,
  totalPublishers: 98,
  totalHours: 14890,
  averageHoursPerPublisher: 11.2,
  projectedAnnualHours: 17500,
  averageBibleStudies: 44,
  studiesDiffFromLastMonth: 3,
  studiesRatio: 0.47,
};

export const ConsolidatedMetricsSummary: React.FC<ConsolidatedMetricsSummaryProps> = ({
  data = DEFAULT_METRICS,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Metric 1: Participación Activa */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-outline font-semibold">
              Participación Activa
            </span>
            <h3 className="text-base font-bold text-on-surface mt-1">
              Promedio Publicadores
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-primary">
            {data.averagePublishers.toFixed(1)}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">hermanos / mes</span>
        </div>

        <div className="mt-3 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant">
          <span className="text-secondary font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{data.publishersTrendPct}%
          </span>
          <span>Total publicadores: {data.totalPublishers}</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-surface-container-high/40 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Metric 2: Ministerio del Campo */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-outline font-semibold">
              Ministerio del Campo
            </span>
            <h3 className="text-base font-bold text-on-surface mt-1">
              Horas Totales Acumuladas
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-on-surface">
            {data.totalHours.toLocaleString()}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">hrs en el año</span>
        </div>

        <div className="mt-3 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant">
          <span className="bg-secondary-container/50 text-on-secondary-container px-2 py-0.5 rounded font-semibold text-[11px]">
            Promedio: {data.averageHoursPerPublisher} hrs/pub
          </span>
          <span className="text-outline">
            Cierre proyectado: {(data.projectedAnnualHours / 1000).toFixed(1)}k
          </span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-container/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Metric 3: Enseñanza y Discipulado */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-outline font-semibold">
              Enseñanza y Discipulado
            </span>
            <h3 className="text-base font-bold text-on-surface mt-1">
              Cursos Bíblicos Promedio
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-tertiary">
            <BookOpen className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-primary">
            {data.averageBibleStudies}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">estudios activos</span>
        </div>

        <div className="mt-3 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant">
          <span className="text-secondary font-bold flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" /> +{data.studiesDiffFromLastMonth} estudios vs Sep
          </span>
          <span className="text-outline">{data.studiesRatio} estudios/pub</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-surface-container-highest/40 rounded-full blur-xl pointer-events-none" />
      </div>
    </div>
  );
};

ConsolidatedMetricsSummary.displayName = 'ConsolidatedMetricsSummary';
