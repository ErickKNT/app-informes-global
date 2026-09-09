import { describe, it, expect, beforeEach } from 'vitest';
import { attendanceService } from './attendanceService';

describe('attendanceService', () => {
  beforeEach(() => {
    attendanceService.resetLocal();
  });

  it('obtiene los registros iniciales de asistencia para octubre 2024', async () => {
    const result = await attendanceService.getAttendanceRecords(10, 2024);
    expect(result.error).toBeNull();
    expect(result.data).not.toBeNull();
    expect(result.data?.length).toBe(8);
  });

  it('permite registrar y luego eliminar una nueva asistencia', async () => {
    const saveResult = await attendanceService.saveAttendanceRecord({
      date: '2024-10-30',
      meeting_type: 'midweek',
      attendance_count: 86,
      notes: 'Fin de mes',
      month: 10,
      year: 2024,
    });

    expect(saveResult.data?.attendance_count).toBe(86);
    expect(saveResult.data?.id).toBeDefined();

    const deleteResult = await attendanceService.deleteAttendanceRecord(saveResult.data!.id);
    expect(deleteResult.data).toBe(true);

    const check = await attendanceService.getAttendanceRecords(10, 2024);
    expect(check.data?.some((r) => r.id === saveResult.data!.id)).toBe(false);
  });
});
