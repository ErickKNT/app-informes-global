import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import type { MeetingAttendanceRecord, MeetingType } from '@/types/database.types';
import { X, CalendarCheck, Users, FileText, CheckCircle2 } from 'lucide-react';

export interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    date: string;
    meeting_type: MeetingType;
    attendance_count: number;
    notes?: string | null;
  }) => Promise<void> | void;
  recordToEdit?: MeetingAttendanceRecord | null;
  isLoading?: boolean;
}

export const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recordToEdit,
  isLoading = false,
}) => {
  const [date, setDate] = useState(
    recordToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [meetingType, setMeetingType] = useState<MeetingType>(
    recordToEdit?.meeting_type || 'midweek'
  );
  const [count, setCount] = useState<number | ''>(
    recordToEdit?.attendance_count ?? 80
  );
  const [notes, setNotes] = useState(recordToEdit?.notes || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (recordToEdit) {
      setDate(recordToEdit.date);
      setMeetingType(recordToEdit.meeting_type);
      setCount(recordToEdit.attendance_count);
      setNotes(recordToEdit.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setMeetingType('midweek');
      setCount(80);
      setNotes('');
    }
    setError(null);
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('La fecha es obligatoria.');
      return;
    }
    if (count === '' || count <= 0) {
      setError('El número de asistentes debe ser mayor a 0.');
      return;
    }

    try {
      await onSave({
        id: recordToEdit?.id,
        date,
        meeting_type: meetingType,
        attendance_count: Number(count),
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la asistencia');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 bg-surface-container-low border-b border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs shrink-0">
              <CalendarCheck className="w-5 h-5 text-primary-fixed" />
            </div>
            <div className="flex flex-col">
              <h2
                id="attendance-modal-title"
                className="font-headline text-base font-bold text-on-surface"
              >
                {recordToEdit ? 'Editar Registro de Asistencia' : 'Registrar Asistencia de Reunión'}
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">
                Cómputo semanal de asistencia congregacional
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body con scroll */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 overscroll-contain">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/40 border border-error-container text-xs text-error font-medium">
              {error}
            </div>
          )}

          {/* Fecha */}
          <FormField id="attendance-date" label="Fecha de la Reunión" required>
            <Input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </FormField>

          {/* Tipo de Reunión */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="attendance-type"
              className="text-xs font-semibold text-on-surface uppercase tracking-wider"
            >
              Tipo de Reunión <span className="text-error">*</span>
            </label>
            <Select<MeetingType>
              id="attendance-type"
              ariaLabel="Tipo de reunión"
              value={meetingType}
              onChange={(val) => setMeetingType(val as MeetingType)}
              disabled={isLoading}
              options={[
                {
                  value: 'midweek',
                  label: 'Entre semana · Vida y Ministerio Cristianos (VMC)',
                },
                {
                  value: 'weekend',
                  label: 'Fin de semana · Discurso Público y La Atalaya',
                },
              ]}
            />
          </div>

          {/* Número de Asistentes */}
          <FormField id="attendance-count" label="Número de Asistentes" required>
            <div className="relative">
              <Input
                id="attendance-count"
                type="number"
                min={1}
                max={5000}
                value={count}
                onChange={(e) => setCount(e.target.value ? Number(e.target.value) : '')}
                required
                disabled={isLoading}
                placeholder="Ej. 85"
                className="pl-9"
              />
              <Users className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>

          {/* Notas u observaciones */}
          <FormField id="attendance-notes" label="Notas u Observaciones (Opcional)">
            <div className="relative">
              <Input
                id="attendance-notes"
                type="text"
                placeholder="Ej. Visita del superintendente de circuito o clima"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                className="pl-9"
              />
              <FileText className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-high/60 mt-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
              className="text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Guardando...' : recordToEdit ? 'Actualizar' : 'Guardar Asistencia'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
