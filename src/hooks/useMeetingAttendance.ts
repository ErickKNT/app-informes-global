import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MeetingAttendanceRecord, MeetingType } from '@/types/database.types';
import { attendanceService, INITIAL_ATTENDANCE_RECORDS } from '@/services/attendanceService';

export interface UseMeetingAttendanceOptions {
  initialMonth?: number;
  initialYear?: number;
}

export interface UseMeetingAttendanceReturn {
  records: MeetingAttendanceRecord[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  midweekAverage: number;
  weekendAverage: number;
  overallAverage: number;
  maxAttendance: number;
  totalMeetings: number;
  midweekCount: number;
  weekendCount: number;
  isLoading: boolean;
  saveRecord: (data: {
    id?: string;
    date: string;
    meeting_type: MeetingType;
    attendance_count: number;
    notes?: string | null;
  }) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export function useMeetingAttendance(
  options: UseMeetingAttendanceOptions = {}
): UseMeetingAttendanceReturn {
  const [selectedMonth, setSelectedMonth] = useState(options.initialMonth || 10);
  const [selectedYear, setSelectedYear] = useState(options.initialYear || 2024);
  const [records, setRecords] = useState<MeetingAttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = useCallback(async (month: number, year: number) => {
    setIsLoading(true);
    const result = await attendanceService.getAttendanceRecords(month, year);
    if (result.data) {
      setRecords(result.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchRecords]);

  // Cálculos estadísticos canónicos
  const {
    midweekAverage,
    weekendAverage,
    overallAverage,
    maxAttendance,
    totalMeetings,
    midweekCount,
    weekendCount,
  } = useMemo(() => {
    const midweekRecords = records.filter((r) => r.meeting_type === 'midweek');
    const weekendRecords = records.filter((r) => r.meeting_type === 'weekend');

    const totalMidweek = midweekRecords.reduce((sum, r) => sum + r.attendance_count, 0);
    const totalWeekend = weekendRecords.reduce((sum, r) => sum + r.attendance_count, 0);
    const grandTotal = totalMidweek + totalWeekend;

    const mwAvg = midweekRecords.length > 0 ? Math.round((totalMidweek / midweekRecords.length) * 10) / 10 : 0;
    const wkAvg = weekendRecords.length > 0 ? Math.round((totalWeekend / weekendRecords.length) * 10) / 10 : 0;
    const ovAvg = records.length > 0 ? Math.round((grandTotal / records.length) * 10) / 10 : 0;
    const maxAtt = records.length > 0 ? Math.max(...records.map((r) => r.attendance_count)) : 0;

    return {
      midweekAverage: mwAvg,
      weekendAverage: wkAvg,
      overallAverage: ovAvg,
      maxAttendance: maxAtt,
      totalMeetings: records.length,
      midweekCount: midweekRecords.length,
      weekendCount: weekendRecords.length,
    };
  }, [records]);

  const saveRecord = useCallback(
    async (data: {
      id?: string;
      date: string;
      meeting_type: MeetingType;
      attendance_count: number;
      notes?: string | null;
    }) => {
      setIsLoading(true);
      const res = await attendanceService.saveAttendanceRecord({
        ...data,
        notes: data.notes ?? null,
        month: selectedMonth,
        year: selectedYear,
      });

      if (res.data) {
        setRecords((prev) => {
          const index = prev.findIndex((r) => r.id === res.data!.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = res.data!;
            return updated.sort((a, b) => a.date.localeCompare(b.date));
          }
          return [...prev, res.data!].sort((a, b) => a.date.localeCompare(b.date));
        });
      }
      setIsLoading(false);
    },
    [selectedMonth, selectedYear]
  );

  const deleteRecord = useCallback(async (id: string) => {
    setIsLoading(true);
    await attendanceService.deleteAttendanceRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setIsLoading(false);
  }, []);

  return {
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
    isLoading,
    saveRecord,
    deleteRecord,
  };
}
