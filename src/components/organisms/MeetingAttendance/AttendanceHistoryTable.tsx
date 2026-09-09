import React from 'react';
import type { MeetingAttendanceRecord } from '@/types/database.types';
import { Button } from '@/components/atoms/Button';
import { Calendar, Users, Edit3, Trash2, CalendarCheck } from 'lucide-react';

export interface AttendanceHistoryTableProps {
  records: MeetingAttendanceRecord[];
  onEdit: (record: MeetingAttendanceRecord) => void;
  onDelete: (id: string) => void;
}

const formatDatePretty = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({
  records,
  onEdit,
  onDelete,
}) => {
  if (records.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-10 border border-surface-container-high/60 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-outline">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-on-surface">Sin registros en este mes</span>
          <span className="text-xs text-on-surface-variant max-w-sm">
            Aún no se ha registrado la asistencia de las reuniones para el período seleccionado.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 shadow-xs overflow-hidden flex flex-col w-full">
      <div className="p-4 sm:p-5 border-b border-surface-container-high/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-headline text-sm font-bold text-on-surface">
            Detalle de Reuniones del Mes ({records.length})
          </h3>
        </div>
        <span className="text-[11px] text-outline font-medium hidden sm:inline">
          Orden cronológico
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-low/80 text-outline border-b border-surface-container-high/60 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Tipo de Reunión</th>
              <th className="py-3 px-4 text-center">Asistentes</th>
              <th className="py-3 px-4">Observaciones</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40">
            {records.map((rec) => {
              const isMidweek = rec.meeting_type === 'midweek';

              return (
                <tr
                  key={rec.id}
                  className="hover:bg-surface-container-low/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-on-surface capitalize whitespace-nowrap">
                    {formatDatePretty(rec.date)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isMidweek
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }`}
                    >
                      {isMidweek ? 'Entre Semana (VMC)' : 'Fin de Semana (Atalaya)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-headline font-bold text-sm text-on-surface">
                      <Users className="w-3.5 h-3.5 text-outline" />
                      <span>{rec.attendance_count}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant max-w-xs truncate">
                    {rec.notes || <span className="text-outline italic">Sin observaciones</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(rec)}
                        className="p-1.5 text-outline hover:text-primary hover:bg-primary/10"
                        title="Editar reunión"
                        aria-label={`Editar reunión del ${rec.date}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(rec.id)}
                        className="p-1.5 text-outline hover:text-error hover:bg-error/10"
                        title="Eliminar reunión"
                        aria-label={`Eliminar reunión del ${rec.date}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
