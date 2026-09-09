import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMeetingAttendance } from './useMeetingAttendance';
import { attendanceService } from '@/services/attendanceService';

describe('useMeetingAttendance hook', () => {
  beforeEach(() => {
    attendanceService.resetLocal();
  });

  it('calcula correctamente los promedios de entre semana y fin de semana', async () => {
    const { result } = renderHook(() =>
      useMeetingAttendance({ initialMonth: 10, initialYear: 2024 })
    );

    // Initial records:
    // Midweek: 82, 79, 84, 81 -> sum: 326 / 4 = 81.5
    // Weekend: 96, 91, 102, 89 -> sum: 378 / 4 = 94.5
    expect(result.current.midweekAverage).toBe(81.5);
    expect(result.current.weekendAverage).toBe(94.5);
    expect(result.current.maxAttendance).toBe(102);
    expect(result.current.totalMeetings).toBe(8);
  });

  it('permite registrar una nueva asistencia y recalcular promedios', async () => {
    const { result } = renderHook(() =>
      useMeetingAttendance({ initialMonth: 10, initialYear: 2024 })
    );

    await act(async () => {
      await result.current.saveRecord({
        date: '2024-10-31',
        meeting_type: 'midweek',
        attendance_count: 90,
        notes: 'Reunión especial de fin de mes',
      });
    });

    // 5 midweek meetings: 82, 79, 84, 81, 90 -> sum: 416 / 5 = 83.2
    expect(result.current.midweekCount).toBe(5);
    expect(result.current.midweekAverage).toBe(83.2);
  });
});
