import React from 'react';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';

export interface S21MonthRow {
  id: string;
  monthName: string;
  publishersCount: number;
  regularPioneersCount: number;
  auxiliaryPioneersCount: number;
  totalHours: number;
  bibleStudies: number;
  averageHours: number;
  status: 'closed_audited' | 'in_progress' | 'pending';
  completionRate?: number;
}

export interface S21ConsolidatedTableProps {
  serviceYear?: string;
  rows?: S21MonthRow[];
}

const DEFAULT_ROWS: S21MonthRow[] = [
  {
    id: 'm-sep-2024',
    monthName: 'Septiembre 2024',
    publishersCount: 95,
    regularPioneersCount: 8,
    auxiliaryPioneersCount: 6,
    totalHours: 1480,
    bibleStudies: 42,
    averageHours: 15.5,
    status: 'closed_audited',
  },
  {
    id: 'm-oct-2024',
    monthName: 'Octubre 2024',
    publishersCount: 93,
    regularPioneersCount: 8,
    auxiliaryPioneersCount: 9,
    totalHours: 1540,
    bibleStudies: 45,
    averageHours: 16.5,
    status: 'in_progress',
    completionRate: 94,
  },
];

export const S21ConsolidatedTable: React.FC<S21ConsolidatedTableProps> = ({
  serviceYear = '2024-2025',
  rows = DEFAULT_ROWS,
}) => {
  // Accumulation calculations
  const totalMonths = rows.length;
  const totalHoursAccumulated = rows.reduce((acc, r) => acc + r.totalHours, 0);
  const avgPublishers =
    totalMonths > 0
      ? (rows.reduce((acc, r) => acc + r.publishersCount, 0) / totalMonths).toFixed(1)
      : '0.0';
  const avgRegularPioneers =
    totalMonths > 0
      ? Math.round(rows.reduce((acc, r) => acc + r.regularPioneersCount, 0) / totalMonths)
      : 0;
  const totalAuxiliaryPioneers = rows.reduce(
    (acc, r) => acc + r.auxiliaryPioneersCount,
    0
  );
  const avgStudies =
    totalMonths > 0
      ? (rows.reduce((acc, r) => acc + r.bibleStudies, 0) / totalMonths).toFixed(1)
      : '0.0';
  const avgHours =
    totalMonths > 0
      ? (rows.reduce((acc, r) => acc + r.averageHours, 0) / totalMonths).toFixed(1)
      : '0.0';

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold">
            Registro Oficial de la Congregación
          </span>
          <h2 className="font-headline text-xl font-extrabold text-on-surface">
            Tabla Consolidada por Meses (Año de Servicio {serviceYear})
          </h2>
        </div>
        <span className="font-semibold text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Formato S-21-S
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-surface-container-high/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Mes de Servicio</th>
              <th className="py-3 px-4 text-right">Pubs. Informaron</th>
              <th className="py-3 px-4 text-right">Prec. Regulares</th>
              <th className="py-3 px-4 text-right">Prec. Auxiliares</th>
              <th className="py-3 px-4 text-right">Horas Totales</th>
              <th className="py-3 px-4 text-right">Cursos Bíblicos</th>
              <th className="py-3 px-4 text-right">Prom. Horas</th>
              <th className="py-3 px-4 text-center">Estado Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 text-on-surface">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td className="py-3 px-4 font-semibold flex items-center gap-2">
                  {row.status === 'closed_audited' ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span>{row.monthName}</span>
                </td>
                <td className="py-3 px-4 text-right font-medium">{row.publishersCount}</td>
                <td className="py-3 px-4 text-right font-medium text-secondary">
                  {row.regularPioneersCount}
                </td>
                <td className="py-3 px-4 text-right font-medium text-amber-700">
                  {row.auxiliaryPioneersCount}
                </td>
                <td className="py-3 px-4 text-right font-bold text-primary">
                  {row.totalHours.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-medium">{row.bibleStudies}</td>
                <td className="py-3 px-4 text-right font-medium">{row.averageHours}</td>
                <td className="py-3 px-4 text-center">
                  {row.status === 'closed_audited' ? (
                    <Badge variant="entregado">Cerrado / Auditado</Badge>
                  ) : (
                    <Badge variant="info">
                      En Proceso {row.completionRate ? `(${row.completionRate}%)` : ''}
                    </Badge>
                  )}
                </td>
              </tr>
            ))}

            {/* Summary / Accumulation Row */}
            <tr className="bg-surface-container/60 font-semibold text-on-surface border-t-2 border-surface-container-high">
              <td className="py-3.5 px-4 font-extrabold uppercase text-[11px] text-primary">
                Total Acumulado ({totalMonths} Meses)
              </td>
              <td className="py-3.5 px-4 text-right font-bold">
                {avgPublishers}{' '}
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (prom.)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-secondary">
                {avgRegularPioneers}{' '}
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (prom.)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                {totalAuxiliaryPioneers}{' '}
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (total)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-extrabold text-sm text-primary">
                {totalHoursAccumulated.toLocaleString()} hrs
              </td>
              <td className="py-3.5 px-4 text-right font-bold">
                {avgStudies}{' '}
                <span className="text-[10px] text-on-surface-variant font-normal">
                  (prom.)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-bold">{avgHours} hrs</td>
              <td className="py-3.5 px-4 text-center text-[11px] text-on-surface-variant font-medium">
                {totalMonths} / 12 Meses Registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

S21ConsolidatedTable.displayName = 'S21ConsolidatedTable';
