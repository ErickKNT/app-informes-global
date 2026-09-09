import { supabase } from './supabaseClient';
import type { MeetingAttendanceRecord } from '@/types/database.types';
import type { ServiceResult } from './reportsService';

export const INITIAL_ATTENDANCE_RECORDS: MeetingAttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2024-10-02',
    meeting_type: 'midweek',
    attendance_count: 82,
    notes: 'Reunión de entre semana VMC',
    month: 10,
    year: 2024,
    created_at: '2024-10-02T20:00:00Z',
  },
  {
    id: 'att-2',
    date: '2024-10-06',
    meeting_type: 'weekend',
    attendance_count: 96,
    notes: 'Discurso Público y La Atalaya',
    month: 10,
    year: 2024,
    created_at: '2024-10-06T12:00:00Z',
  },
  {
    id: 'att-3',
    date: '2024-10-09',
    meeting_type: 'midweek',
    attendance_count: 79,
    notes: null,
    month: 10,
    year: 2024,
    created_at: '2024-10-09T20:00:00Z',
  },
  {
    id: 'att-4',
    date: '2024-10-13',
    meeting_type: 'weekend',
    attendance_count: 91,
    notes: null,
    month: 10,
    year: 2024,
    created_at: '2024-10-13T12:00:00Z',
  },
  {
    id: 'att-5',
    date: '2024-10-16',
    meeting_type: 'midweek',
    attendance_count: 84,
    notes: 'Asistencia presencial y por Zoom',
    month: 10,
    year: 2024,
    created_at: '2024-10-16T20:00:00Z',
  },
  {
    id: 'att-6',
    date: '2024-10-20',
    meeting_type: 'weekend',
    attendance_count: 102,
    notes: 'Visita del Superintendente de Circuito',
    month: 10,
    year: 2024,
    created_at: '2024-10-20T12:00:00Z',
  },
  {
    id: 'att-7',
    date: '2024-10-23',
    meeting_type: 'midweek',
    attendance_count: 81,
    notes: null,
    month: 10,
    year: 2024,
    created_at: '2024-10-23T20:00:00Z',
  },
  {
    id: 'att-8',
    date: '2024-10-27',
    meeting_type: 'weekend',
    attendance_count: 89,
    notes: null,
    month: 10,
    year: 2024,
    created_at: '2024-10-27T12:00:00Z',
  },
];

let localRecords: MeetingAttendanceRecord[] = [...INITIAL_ATTENDANCE_RECORDS];

export const attendanceService = {
  /**
   * Obtiene los registros de asistencia para un mes y año dados
   */
  async getAttendanceRecords(
    month?: number,
    year?: number
  ): Promise<ServiceResult<MeetingAttendanceRecord[]>> {
    try {
      // Intentar consultar Supabase si está disponible
      let query = supabase.from('meeting_attendance' as any).select('*');
      if (month) query = query.eq('month', month);
      if (year) query = query.eq('year', year);

      const { data, error } = await query.order('date', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data: data as unknown as MeetingAttendanceRecord[], error: null };
      }

      // Fallback local
      let filtered = [...localRecords];
      if (month) filtered = filtered.filter((r) => r.month === month);
      if (year) filtered = filtered.filter((r) => r.year === year);
      filtered.sort((a, b) => a.date.localeCompare(b.date));

      return { data: filtered, error: null };
    } catch {
      let filtered = [...localRecords];
      if (month) filtered = filtered.filter((r) => r.month === month);
      if (year) filtered = filtered.filter((r) => r.year === year);
      return { data: filtered, error: null };
    }
  },

  /**
   * Guarda o actualiza un registro de asistencia
   */
  async saveAttendanceRecord(
    record: Omit<MeetingAttendanceRecord, 'id'> & { id?: string }
  ): Promise<ServiceResult<MeetingAttendanceRecord>> {
    const id = record.id || `att-${Date.now()}`;
    const fullRecord: MeetingAttendanceRecord = {
      id,
      date: record.date,
      meeting_type: record.meeting_type,
      attendance_count: record.attendance_count,
      notes: record.notes || null,
      month: record.month,
      year: record.year,
      created_at: new Date().toISOString(),
    };

    // Actualizar localmente
    const existingIndex = localRecords.findIndex((r) => r.id === id);
    if (existingIndex >= 0) {
      localRecords[existingIndex] = fullRecord;
    } else {
      localRecords.push(fullRecord);
    }

    // Enviar a Supabase en segundo plano si existe
    try {
      await supabase.from('meeting_attendance' as any).upsert(fullRecord as any);
    } catch {
      // No bloqueante
    }

    return { data: fullRecord, error: null };
  },

  /**
   * Elimina un registro de asistencia
   */
  async deleteAttendanceRecord(id: string): Promise<ServiceResult<boolean>> {
    localRecords = localRecords.filter((r) => r.id !== id);

    try {
      await supabase.from('meeting_attendance' as any).delete().eq('id', id);
    } catch {
      // No bloqueante
    }

    return { data: true, error: null };
  },

  /**
   * Reinicia registros a los valores iniciales de prueba
   */
  resetLocal(): void {
    localRecords = [...INITIAL_ATTENDANCE_RECORDS];
  },
};
