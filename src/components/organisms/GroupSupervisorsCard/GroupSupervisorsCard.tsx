import React from 'react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/atoms/Avatar';
import { MapPin, Clock } from 'lucide-react';

export interface SupervisorInfo {
  name: string;
  role: string;
  avatarUrl?: string | null;
}

export interface GroupSupervisorsCardProps {
  groupName: string;
  overseer: SupervisorInfo;
  assistant: SupervisorInfo;
  location?: string | null;
  schedule?: string | null;
  className?: string;
}

export const GroupSupervisorsCard: React.FC<GroupSupervisorsCardProps> = ({
  groupName,
  overseer,
  assistant,
  location = 'Salón del Reino',
  schedule = 'Sábados 09:30 AM',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col justify-between gap-4',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Supervisión Pastoral
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Activo
          </span>
        </div>
        <h2 className="font-headline text-lg font-bold text-on-surface tracking-tight">
          {groupName}
        </h2>
      </div>

      {/* Roster de Encargados */}
      <div className="flex flex-col gap-2.5">
        {/* Encargado */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/60">
          <Avatar name={overseer.name} src={overseer.avatarUrl} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">{overseer.name}</span>
            <span className="text-[11px] text-secondary font-semibold">{overseer.role}</span>
          </div>
        </div>

        {/* Auxiliar */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/60">
          <Avatar name={assistant.name} src={assistant.avatarUrl} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">{assistant.name}</span>
            <span className="text-[11px] text-on-surface-variant font-medium">{assistant.role}</span>
          </div>
        </div>
      </div>

      {/* Información de Punto de Reunión y Horario */}
      <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-surface-container-high text-on-surface-variant text-[11px] gap-2">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{location}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span>{schedule}</span>
        </span>
      </div>
    </div>
  );
};

GroupSupervisorsCard.displayName = 'GroupSupervisorsCard';

