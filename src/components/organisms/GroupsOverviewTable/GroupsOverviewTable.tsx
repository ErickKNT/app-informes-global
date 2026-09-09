import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

export interface GroupOverviewItem {
  id: string;
  groupNumber: number;
  name: string;
  overseerName: string;
  publishersCount: number;
  reportedCount: number;
  totalHours: number;
  bibleStudies: number;
}

export interface GroupsOverviewTableProps {
  groups: GroupOverviewItem[];
  onViewGroup?: (groupId: string) => void;
  className?: string;
}

export const GroupsOverviewTable: React.FC<GroupsOverviewTableProps> = ({
  groups,
  onViewGroup,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="p-5 border-b border-surface-container-high flex items-center justify-between">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">
            Estado de Entrega por Grupos
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Avance de recepción mensual en cada grupo de servicio
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/60 text-outline uppercase font-semibold text-[11px] tracking-wider border-b border-surface-container-high">
              <th scope="col" className="py-3 px-5">Grupo de Servicio</th>
              <th scope="col" className="py-3 px-4">Encargado</th>
              <th scope="col" className="py-3 px-4 text-center">Publicadores</th>
              <th scope="col" className="py-3 px-4">Progreso Entrega</th>
              <th scope="col" className="py-3 px-4 text-right">Horas</th>
              <th scope="col" className="py-3 px-4 text-center">Cursos</th>
              <th scope="col" className="py-3 px-4 text-center">Estado</th>
              <th scope="col" className="py-3 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-xs">
            {groups.map((group) => {
              const percentage =
                group.publishersCount > 0
                  ? Math.round((group.reportedCount / group.publishersCount) * 100)
                  : 0;
              const isComplete = group.reportedCount === group.publishersCount;

              return (
                <tr
                  key={group.id}
                  className="hover:bg-surface-container-low/40 transition-colors"
                >
                  <td className="py-3.5 px-5 font-bold text-on-surface">
                    {group.name}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {group.overseerName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold">
                    {group.publishersCount}
                  </td>
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant">
                        <span>{group.reportedCount}/{group.publishersCount}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isComplete ? 'bg-secondary' : 'bg-primary'
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-primary">
                    {group.totalHours} hrs
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold">
                    {group.bibleStudies}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                        <CheckCircle className="w-3.5 h-3.5" /> Al día
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary-container">
                        <AlertCircle className="w-3.5 h-3.5" /> Faltantes
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {onViewGroup && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewGroup(group.id)}
                        className="text-xs p-1.5 text-primary hover:bg-primary-fixed/40"
                        title="Ver detalle del grupo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

GroupsOverviewTable.displayName = 'GroupsOverviewTable';
