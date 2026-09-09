import React from 'react';
import { cn } from '@/utils/cn';
import { Users, CheckCircle, Clock, BookOpen } from 'lucide-react';

export interface GroupMetrics {
  totalPublishers: number;
  reportedPublishers: number;
  totalHours: number;
  totalBibleStudies: number;
}

export interface GroupMetricsCardsProps {
  metrics: GroupMetrics;
  className?: string;
}

export const GroupMetricsCards: React.FC<GroupMetricsCardsProps> = ({
  metrics,
  className,
}) => {
  const pendingCount = Math.max(0, metrics.totalPublishers - metrics.reportedPublishers);
  const percentage =
    metrics.totalPublishers > 0
      ? Math.round((metrics.reportedPublishers / metrics.totalPublishers) * 100)
      : 0;

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4 w-full', className)}>
      {/* 1. Publicadores */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Publicadores
          </span>
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="my-2.5">
          <span className="font-headline text-2xl font-extrabold text-on-surface leading-none">
            {metrics.totalPublishers}
          </span>
          <span className="text-xs text-on-surface-variant ml-1 font-medium">hermanos</span>
        </div>
        <div className="flex items-center gap-1 text-secondary text-xs font-medium pt-2 border-t border-surface-container-high">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>100% asignados</span>
        </div>
      </div>

      {/* 2. Cumplimiento */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Cumplimiento
          </span>
          <CheckCircle className="w-5 h-5 text-secondary" />
        </div>
        <div className="my-2 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline text-2xl font-extrabold text-secondary leading-none">
              {percentage}%
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {metrics.reportedPublishers}/{metrics.totalPublishers}
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-on-surface-variant pt-2 border-t border-surface-container-high">
          <span className="text-tertiary-container font-semibold">
            {pendingCount} pendientes
          </span>
        </div>
      </div>

      {/* 3. Horas del Mes */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Horas Mes
          </span>
          <Clock className="w-5 h-5 text-tertiary-container" />
        </div>
        <div className="my-2.5">
          <span className="font-headline text-2xl font-extrabold text-on-surface leading-none">
            {metrics.totalHours}
          </span>
          <span className="text-xs text-on-surface-variant ml-1 font-medium">hrs</span>
        </div>
        <div className="text-xs text-secondary font-medium pt-2 border-t border-surface-container-high">
          <span>Reportadas este mes</span>
        </div>
      </div>

      {/* 4. Cursos Bíblicos */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Cursos Bíblicos
          </span>
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div className="my-2.5">
          <span className="font-headline text-2xl font-extrabold text-on-surface leading-none">
            {metrics.totalBibleStudies}
          </span>
          <span className="text-xs text-on-surface-variant ml-1 font-medium">activos</span>
        </div>
        <div className="text-xs text-primary font-medium pt-2 border-t border-surface-container-high">
          <span>Estudios del grupo</span>
        </div>
      </div>
    </div>
  );
};

GroupMetricsCards.displayName = 'GroupMetricsCards';
