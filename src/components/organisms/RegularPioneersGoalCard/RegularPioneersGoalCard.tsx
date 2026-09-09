import React, { useState } from 'react';
import {
  Flag,
  Mail,
  ArrowUp,
  Check,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { cn } from '@/utils/cn';

export interface RegularPioneerItem {
  id: string;
  fullName: string;
  groupName: string;
  tenureYears: number;
  annualHours: number;
  currentMonthHours: number;
  activeStudies: number;
  status: 'surplus' | 'on_track' | 'lagging';
  diffHours: number;
}

export interface RegularPioneersGoalCardProps {
  annualGoal?: number;
  expectedCumulativeHours?: number;
  pioneers?: RegularPioneerItem[];
  onNotifyPioneers?: () => Promise<void> | void;
}

const DEFAULT_PIONEERS: RegularPioneerItem[] = [
  {
    id: 'p-1',
    fullName: 'Mateo González',
    groupName: 'Grupo #1',
    tenureYears: 3,
    annualHours: 108,
    currentMonthHours: 54,
    activeStudies: 6,
    status: 'surplus',
    diffHours: 8,
  },
  {
    id: 'p-2',
    fullName: 'Carmen Ramírez',
    groupName: 'Grupo #3',
    tenureYears: 1,
    annualHours: 100,
    currentMonthHours: 50,
    activeStudies: 5,
    status: 'on_track',
    diffHours: 0,
  },
  {
    id: 'p-3',
    fullName: 'Lucas Silva',
    groupName: 'Grupo #2',
    tenureYears: 5,
    annualHours: 95,
    currentMonthHours: 45,
    activeStudies: 4,
    status: 'lagging',
    diffHours: -5,
  },
  {
    id: 'p-4',
    fullName: 'Elena Torres',
    groupName: 'Grupo #4',
    tenureYears: 2,
    annualHours: 112,
    currentMonthHours: 58,
    activeStudies: 7,
    status: 'surplus',
    diffHours: 12,
  },
  {
    id: 'p-5',
    fullName: 'Daniel Ortiz',
    groupName: 'Grupo #5',
    tenureYears: 4,
    annualHours: 102,
    currentMonthHours: 51,
    activeStudies: 5,
    status: 'surplus',
    diffHours: 2,
  },
  {
    id: 'p-6',
    fullName: 'Sara Medina',
    groupName: 'Grupo #1',
    tenureYears: 1,
    annualHours: 98,
    currentMonthHours: 48,
    activeStudies: 3,
    status: 'lagging',
    diffHours: -2,
  },
  {
    id: 'p-7',
    fullName: 'Gabriel Vargas',
    groupName: 'Grupo #3',
    tenureYears: 6,
    annualHours: 105,
    currentMonthHours: 52,
    activeStudies: 6,
    status: 'surplus',
    diffHours: 5,
  },
  {
    id: 'p-8',
    fullName: 'Rebeca Flores',
    groupName: 'Grupo #2',
    tenureYears: 2,
    annualHours: 100,
    currentMonthHours: 50,
    activeStudies: 4,
    status: 'on_track',
    diffHours: 0,
  },
];

export const RegularPioneersGoalCard: React.FC<RegularPioneersGoalCardProps> = ({
  annualGoal = 600,
  expectedCumulativeHours = 100,
  pioneers = DEFAULT_PIONEERS,
  onNotifyPioneers,
}) => {
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedPioneers = showAll ? pioneers : pioneers.slice(0, 4);
  const remainingCount = pioneers.length - 4;

  const handleNotify = async () => {
    setIsNotifying(true);
    try {
      if (onNotifyPioneers) {
        await onNotifyPioneers();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 4000);
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider">
            <Flag className="w-4 h-4" />
            <span>Supervisión de Servicio de Tiempo Completo</span>
          </div>
          <h2 className="font-headline text-xl font-extrabold text-on-surface mt-1">
            Análisis de Metas de Precursores Regulares
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Meta canónica anual: {annualGoal} horas (50 horas/mes). Meta esperada acumulada:{' '}
            {expectedCumulativeHours} hrs.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleNotify}
          isLoading={isNotifying}
          className="text-xs self-start sm:self-auto"
        >
          <Mail className="w-3.5 h-3.5 text-primary" />
          <span>Notificar a Precursores</span>
        </Button>
      </div>

      {notificationSent && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 rounded-xl bg-secondary-container/60 text-on-secondary-container text-xs font-medium flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
          <span>¡Notificación de avance anual enviada a los precursores regulares!</span>
        </div>
      )}

      {/* Pioneer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedPioneers.map((pioneer) => {
          const progressPct = Math.min(
            100,
            Math.round((pioneer.annualHours / annualGoal) * 1000) / 10
          );

          return (
            <div
              key={pioneer.id}
              className="bg-surface-container-low/40 hover:bg-surface-container-low/70 border border-surface-container-high/40 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all duration-200"
            >
              {/* Card Header: Avatar, Name & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar name={pioneer.fullName} size="md" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-on-surface">
                      {pioneer.fullName}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {pioneer.groupName} · {pioneer.tenureYears}º año precursor
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                {pioneer.status === 'surplus' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-container flex items-center gap-1 shrink-0">
                    <ArrowUp className="w-3 h-3" /> Superávit +{pioneer.diffHours}h
                  </span>
                )}
                {pioneer.status === 'on_track' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3" /> Al día
                  </span>
                )}
                {pioneer.status === 'lagging' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-error/15 text-error flex items-center gap-1 shrink-0">
                    <AlertTriangle className="w-3 h-3" /> Rezagado {pioneer.diffHours}h
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>
                    Progreso Anual:{' '}
                    <strong className="text-on-surface">{pioneer.annualHours} hrs</strong> /{' '}
                    {annualGoal} hrs
                  </span>
                  <span
                    className={cn(
                      'font-bold',
                      pioneer.status === 'surplus' && 'text-secondary',
                      pioneer.status === 'on_track' && 'text-primary',
                      pioneer.status === 'lagging' && 'text-error'
                    )}
                  >
                    {progressPct}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      pioneer.status === 'surplus' && 'bg-secondary',
                      pioneer.status === 'on_track' && 'bg-primary',
                      pioneer.status === 'lagging' && 'bg-error'
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-high/60">
                <span>
                  Mes Octubre:{' '}
                  <strong className="text-on-surface">{pioneer.currentMonthHours} hrs</strong>
                </span>
                <span>
                  Cursos bíblicos:{' '}
                  <strong className="text-on-surface">{pioneer.activeStudies}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pastoral Footer Note */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
            <HeartHandshake className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">
              Atención y Pastoreo de Precursores
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Se recomienda entrevista de estímulo semestral con el superintendente de servicio.
            </span>
          </div>
        </div>

        {remainingCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-xs self-start sm:self-auto text-primary font-semibold"
          >
            {showAll
              ? 'Mostrar Menos'
              : `Ver ${remainingCount} Precursores Restantes`}
          </Button>
        )}
      </div>
    </div>
  );
};

RegularPioneersGoalCard.displayName = 'RegularPioneersGoalCard';

