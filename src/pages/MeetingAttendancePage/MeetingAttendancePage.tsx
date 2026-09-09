import React, { useState } from 'react';
import {
  PlusCircle,
  Download,
  Info,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import {
  AttendanceMetricsCards,
  AttendanceFormModal,
  AttendanceHistoryTable,
} from '@/components/organisms/MeetingAttendance';
import { useMeetingAttendance } from '@/hooks/useMeetingAttendance';
import type { MeetingAttendanceRecord } from '@/types/database.types';

const MONTH_OPTIONS = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const YEAR_OPTIONS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
];

export const MeetingAttendancePage: React.FC = () => {
  const {
    records,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    midweekAverage,
    weekendAverage,
    overallAverage,
    maxAttendance,
    totalMeetings,
    midweekCount,
    weekendCount,
    saveRecord,
    deleteRecord,
  } = useMeetingAttendance({ initialMonth: 10, initialYear: 2024 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MeetingAttendanceRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rec: MeetingAttendanceRecord) => {
    setEditingRecord(rec);
    setIsModalOpen(true);
  };

  const handleSave = async (data: {
    id?: string;
    date: string;
    meeting_type: any;
    attendance_count: number;
    notes?: string | null;
  }) => {
    setIsSaving(true);
    try {
      await saveRecord(data);
      setSuccessMessage(
        data.id
          ? 'Registro de asistencia actualizado correctamente.'
          : 'Nueva asistencia registrada con éxito.'
      );
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro de reunión?')) {
      await deleteRecord(id);
      setSuccessMessage('Registro de asistencia eliminado.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleExportCsv = () => {
    const bom = '\uFEFF';
    const lines = [
      'REGISTRO MENSUAL DE ASISTENCIA A LAS REUNIONES',
      `Mes,${selectedMonth}/${selectedYear}`,
      `Promedio Entre Semana (Vida y Ministerio),${midweekAverage}`,
      `Promedio Fin de Semana (Discurso y Atalaya),${weekendAverage}`,
      `Total de Reuniones Celebradas,${totalMeetings}`,
      '',
      'Fecha,Tipo de Reunión,Asistentes,Observaciones',
    ];

    records.forEach((r) => {
      lines.push(
        `${r.date},${r.meeting_type === 'midweek' ? 'Entre semana (VMC)' : 'Fin de semana (Atalaya)'},${r.attendance_count},"${(r.notes || '').replace(/"/g, '""')}"`
      );
    });

    const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencia_reuniones_${selectedYear}_${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container-high/60 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Superintendencia de Servicio · Secretaría</span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              Asistencia a las Reuniones
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Control semanal de concurrencia para la reunión de Entre Semana (VMC) y Fin de Semana (Atalaya).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCsv}
              className="text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-outline" />
              <span>Exportar Asistencia CSV</span>
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenCreateModal}
              className="text-xs flex items-center gap-1.5 font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Asistencia</span>
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant">Mes:</span>
            <Select
              ariaLabel="Seleccionar mes"
              value={String(selectedMonth)}
              onChange={(val) => setSelectedMonth(Number(val))}
              options={MONTH_OPTIONS}
              triggerClassName="w-36 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant">Año:</span>
            <Select
              ariaLabel="Seleccionar año"
              value={String(selectedYear)}
              onChange={(val) => setSelectedYear(Number(val))}
              options={YEAR_OPTIONS}
              triggerClassName="w-28 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-primary-container/40 text-primary border border-primary/20 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 flex items-start gap-3 text-xs text-on-surface">
        <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 leading-relaxed">
          <span className="font-semibold text-secondary">Instrucción para el Secretario</span>
          <p className="text-[11px] text-on-surface-variant">
            Los promedios mensuales mostrados a continuación son los requeridos en el informe congregacional enviado a la sucursal. Se computan sumando la asistencia total de cada reunión y dividiéndola entre el número de reuniones celebradas en el mes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <AttendanceMetricsCards
        midweekAverage={midweekAverage}
        weekendAverage={weekendAverage}
        overallAverage={overallAverage}
        maxAttendance={maxAttendance}
        totalMeetings={totalMeetings}
        midweekCount={midweekCount}
        weekendCount={weekendCount}
      />

      {/* Table of Meetings */}
      <AttendanceHistoryTable
        records={records}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* Modal Form */}
      <AttendanceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        recordToEdit={editingRecord}
        isLoading={isSaving}
      />
    </div>
  );
};
