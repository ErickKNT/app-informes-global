import React from 'react';
import type { PublisherS21Card } from '@/types/database.types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import {
  Phone,
  Users,
  Calendar,
  Edit3,
  ArrowRightLeft,
  UserX,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PublisherCardS21ViewProps {
  card: PublisherS21Card;
  onEditPublisher?: () => void;
  onTransferGroup?: () => void;
  onDeactivatePublisher?: () => void;
  className?: string;
}

export const PublisherCardS21View: React.FC<PublisherCardS21ViewProps> = ({
  card,
  onEditPublisher,
  onTransferGroup,
  onDeactivatePublisher,
  className,
}) => {
  const {
    publisher,
    serviceGroup,
    serviceYear,
    records,
    totalHours,
    averageHours,
    totalStudies,
    annualGoal,
    goalProgressPct,
  } = card;

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-6',
        className
      )}
    >
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-surface-container-high/60">
        <div className="flex items-start gap-4">
          <Avatar
            name={publisher.full_name}
            src={publisher.avatar_url || undefined}
            size="lg"
            className="w-14 h-14 text-base"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-headline text-xl font-extrabold text-on-surface">
                {publisher.full_name}
              </h2>
              <Badge variant={publisher.privilege}>
                {publisher.privilege === 'precursor_regular'
                  ? 'Precursor Regular'
                  : publisher.privilege === 'precursor_auxiliar'
                  ? 'Precursor Auxiliar'
                  : 'Publicador'}
              </Badge>
              {publisher.role !== 'publicador' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">
                  {publisher.role.replace('_', ' ')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-0.5">
              {publisher.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-outline" />
                  <span>{publisher.phone}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-outline" />
                <span>{serviceGroup ? serviceGroup.name : 'Sin grupo asignado'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-outline" />
                <span>Año {serviceYear}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Administrative Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEditPublisher}
            className="text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-outline" />
            <span>Editar Datos / Rol</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onTransferGroup}
            className="text-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-outline" />
            <span>Cambiar Grupo</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDeactivatePublisher}
            className="text-xs text-error hover:bg-error/10 hover:text-error"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Dar de Baja</span>
          </Button>
        </div>
      </div>

      {/* Annual KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" /> Total Horas
          </span>
          <span className="font-headline text-2xl font-extrabold text-primary mt-1">
            {totalHours}
          </span>
          <span className="text-[11px] text-on-surface-variant">año de servicio</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-secondary" /> Promedio
          </span>
          <span className="font-headline text-2xl font-extrabold text-secondary mt-1">
            {averageHours}
          </span>
          <span className="text-[11px] text-on-surface-variant">hrs / mes activo</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Cursos Bíblicos
          </span>
          <span className="font-headline text-2xl font-extrabold text-on-surface mt-1">
            {totalStudies}
          </span>
          <span className="text-[11px] text-on-surface-variant">estudios informados</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-primary" /> Meta Anual
          </span>
          <span className="font-headline text-2xl font-extrabold text-primary mt-1">
            {annualGoal > 0 ? `${goalProgressPct}%` : 'Activo'}
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {annualGoal > 0 ? `${totalHours} de ${annualGoal} hrs` : 'Publicador'}
          </span>
        </div>
      </div>

      {/* S-21 12-Month Canonical Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-on-surface">
            Registro de Actividad Ministerial (Formato Canónico S-21)
          </h3>
          <span className="text-xs text-on-surface-variant">12 Meses Teocráticos</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-surface-container-high/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-center">Participó</th>
                <th className="py-2.5 px-3 text-right">Horas</th>
                <th className="py-2.5 px-3 text-right">Cursos Bíblicos</th>
                <th className="py-2.5 px-3">Notas</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 text-on-surface">
              {records.map((rec) => (
                <tr
                  key={`${rec.year}-${rec.month}`}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold">
                    {rec.monthName} {rec.year}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {rec.participated ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary inline-block" />
                    ) : (
                      <span className="text-outline text-xs">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-primary">
                    {rec.hours > 0 ? rec.hours : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    {rec.bible_studies > 0 ? rec.bible_studies : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-[11px] max-w-[200px] truncate">
                    {rec.notes || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {rec.status === 'confirmado' && (
                      <Badge variant="entregado">Confirmado</Badge>
                    )}
                    {rec.status === 'entregado' && (
                      <Badge variant="regular">Entregado</Badge>
                    )}
                    {rec.status === 'borrador' && (
                      <Badge variant="pendiente">Borrador</Badge>
                    )}
                    {rec.status === 'no_entregado' && (
                      <span className="text-[11px] text-outline">Sin informe</span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-surface-container/60 font-semibold border-t-2 border-surface-container-high text-on-surface">
                <td className="py-3 px-3 uppercase text-[11px] font-extrabold text-primary">
                  Total Anual
                </td>
                <td className="py-3 px-3 text-center font-bold text-secondary">
                  {records.filter((r) => r.participated).length} meses
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-sm text-primary">
                  {totalHours} hrs
                </td>
                <td className="py-3 px-3 text-right font-bold text-on-surface">
                  {totalStudies}
                </td>
                <td className="py-3 px-3 text-[11px] text-on-surface-variant font-medium">
                  Promedio: {averageHours} hrs/mes
                </td>
                <td className="py-3 px-3 text-center text-[11px] text-on-surface-variant font-medium">
                  {records.filter((r) => r.status !== 'no_entregado').length} / 12
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

PublisherCardS21View.displayName = 'PublisherCardS21View';

