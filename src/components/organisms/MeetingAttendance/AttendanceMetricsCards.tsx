import React from 'react';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';

export interface AttendanceMetricsCardsProps {
  midweekAverage: number;
  weekendAverage: number;
  overallAverage: number;
  maxAttendance: number;
  totalMeetings: number;
  midweekCount: number;
  weekendCount: number;
}

export const AttendanceMetricsCards: React.FC<AttendanceMetricsCardsProps> = ({
  midweekAverage,
  weekendAverage,
  overallAverage,
  maxAttendance,
  totalMeetings,
  midweekCount,
  weekendCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Promedio Entre Semana */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/60 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Promedio Entre Semana
          </span>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-on-surface">
            {midweekAverage}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">asistentes / reunión</span>
        </div>
        <div className="text-[11px] text-outline">
          {midweekCount} reunión(es) de Vida y Ministerio
        </div>
      </div>

      {/* Promedio Fin de Semana */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/60 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Promedio Fin de Semana
          </span>
          <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-secondary">
            {weekendAverage}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">asistentes / reunión</span>
        </div>
        <div className="text-[11px] text-outline">
          {weekendCount} discurso(s) y La Atalaya
        </div>
      </div>

      {/* Promedio General */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/60 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Promedio Global
          </span>
          <div className="w-8 h-8 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-on-surface">
            {overallAverage}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">asistentes</span>
        </div>
        <div className="text-[11px] text-outline">
          {totalMeetings} reuniones celebradas en el mes
        </div>
      </div>

      {/* Asistencia Máxima */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/60 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Máxima Concurrencia
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-extrabold text-amber-600">
            {maxAttendance}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">pico del mes</span>
        </div>
        <div className="text-[11px] text-outline">
          Asistencia combinada (presencial + remota)
        </div>
      </div>
    </div>
  );
};
