import React from 'react';
import { cn } from '@/utils/cn';
import { Flag, CheckCircle } from 'lucide-react';

export interface HoursGaugeCardProps {
  hours: number;
  targetHours: number;
  monthName?: string;
  className?: string;
}

export const HoursGaugeCard: React.FC<HoursGaugeCardProps> = ({
  hours,
  targetHours,
  monthName = 'este mes',
  className,
}) => {
  const safeHours = Math.max(0, hours);
  const safeTarget = Math.max(1, targetHours);
  const rawPercentage = Math.round((safeHours / safeTarget) * 100);
  const displayPercentage = rawPercentage;
  const progressRatio = Math.min(1, safeHours / safeTarget);

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeDashoffset = circumference - progressRatio * circumference;

  const remainingHours = Math.max(0, safeTarget - safeHours);
  const isGoalReached = safeHours >= safeTarget;

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high shadow-sm flex flex-col items-center text-center',
        className
      )}
    >
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-outline">
          Meta Mensual de Horas
        </span>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container">
          Meta: {targetHours} hrs
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            className="text-surface-container-high"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
          />
          <circle
            className="text-secondary transition-all duration-700 ease-out"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="font-headline text-3xl font-extrabold text-on-surface leading-none">
            {safeHours}
          </span>
          <span className="text-xs text-on-surface-variant mt-1 font-medium">
            de {targetHours} Horas
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container mt-1.5">
            {displayPercentage}%
          </span>
        </div>
      </div>

      {/* Feedback Alert Pill */}
      <div className="w-full mt-4 p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-center gap-2 text-xs">
        {isGoalReached ? (
          <>
            <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-on-surface font-medium">
              ¡Excelente! Has alcanzado la meta esperada de {monthName}.
            </span>
          </>
        ) : (
          <>
            <Flag className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-on-surface">
              Te faltan <strong className="font-semibold text-secondary">{remainingHours} horas</strong> para tu meta de {monthName}.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

HoursGaugeCard.displayName = 'HoursGaugeCard';

