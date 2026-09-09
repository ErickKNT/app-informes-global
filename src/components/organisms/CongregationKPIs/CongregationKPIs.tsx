import React from 'react';
import { cn } from '@/utils/cn';
import { Sparkline } from '@/components/molecules/Sparkline';
import { Clock, TrendingUp, ClipboardCheck, BookOpen, Award } from 'lucide-react';

export interface CongregationKPIsData {
  totalHours: number;
  previousMonthHours: number;
  hoursHistory: number[]; // para el Sparkline
  reportedPublishers: number;
  totalPublishers: number;
  activeStudies: number;
  newStudiesThisMonth: number;
  pioneersOnTrack: number;
  totalPioneers: number;
}

export interface CongregationKPIsProps {
  data: CongregationKPIsData;
  className?: string;
}

export const CongregationKPIs: React.FC<CongregationKPIsProps> = ({
  data,
  className,
}) => {
  // Cálculos derivados defensivos
  const hoursDelta =
    data.previousMonthHours > 0
      ? (((data.totalHours - data.previousMonthHours) / data.previousMonthHours) * 100).toFixed(1)
      : '0.0';
  const isHoursDeltaPositive = Number(hoursDelta) >= 0;

  const reportedPercentage =
    data.totalPublishers > 0
      ? ((data.reportedPublishers / data.totalPublishers) * 100).toFixed(1)
      : '0.0';
  const remainingPublishers = Math.max(0, data.totalPublishers - data.reportedPublishers);

  const studiesAvg =
    data.totalPublishers > 0
      ? (data.activeStudies / data.totalPublishers).toFixed(2)
      : '0.00';

  const pioneersPercentage =
    data.totalPioneers > 0
      ? ((data.pioneersOnTrack / data.totalPioneers) * 100).toFixed(1)
      : '0.0';

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full', className)}>
      {/* 1. Total Horas Congregación */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Total Horas Congregación
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="my-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline text-3xl font-extrabold text-on-surface leading-none">
              {data.totalHours.toLocaleString('es-MX')}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">hrs</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-secondary text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {isHoursDeltaPositive ? `+${hoursDelta}%` : `${hoursDelta}%`} vs. mes anterior
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="w-full pt-1">
          <Sparkline
            data={data.hoursHistory}
            color="#006c49"
            ariaLabel="Historial mensual de horas"
          />
        </div>
      </div>

      {/* 2. Informes Recibidos */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Informes Recibidos
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
            <ClipboardCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="my-2.5 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-3xl font-extrabold text-on-surface leading-none">
                {data.reportedPublishers}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                / {data.totalPublishers}
              </span>
            </div>
            <span className="text-sm font-bold text-primary">{reportedPercentage}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${reportedPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-on-surface-variant pt-2 border-t border-surface-container-high flex items-center justify-between">
          <span>{remainingPublishers} publicadores restantes</span>
        </div>
      </div>

      {/* 3. Cursos Bíblicos */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Cursos Bíblicos
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="my-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline text-3xl font-extrabold text-on-surface leading-none">
              {data.activeStudies}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">activos</span>
          </div>
          <div className="text-xs text-secondary font-medium mt-1">
            +{data.newStudiesThisMonth} nuevos este mes
          </div>
        </div>

        <div className="text-xs text-on-surface-variant pt-2 border-t border-surface-container-high flex items-center justify-between">
          <span>Promedio:</span>
          <strong className="text-on-surface font-semibold">{studiesAvg} / pub</strong>
        </div>
      </div>

      {/* 4. Precursores en Meta */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Precursores en Meta
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-tertiary-container">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="my-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-3xl font-extrabold text-on-surface leading-none">
                {data.pioneersOnTrack}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                / {data.totalPioneers}
              </span>
            </div>
            <span className="text-sm font-bold text-secondary">{pioneersPercentage}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${pioneersPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-on-surface-variant pt-2 border-t border-surface-container-high flex items-center justify-between">
          <span>{Math.max(0, data.totalPioneers - data.pioneersOnTrack)} en seguimiento</span>
        </div>
      </div>
    </div>
  );
};

CongregationKPIs.displayName = 'CongregationKPIs';
