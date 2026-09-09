import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMonthlyReport } from './useMonthlyReport';
import { reportsService } from '@/services/reportsService';

vi.mock('@/services/reportsService', () => ({
  reportsService: {
    submitReport: vi.fn(),
  },
}));

describe('useMonthlyReport custom hook', () => {
  it('envía el informe con éxito y actualiza el estado', async () => {
    const mockReport = {
      id: 'r-1',
      profile_id: 'p-1',
      service_group_id: 'g-1',
      month: 10,
      year: 2024,
      participated: true,
      hours: 12,
      bible_studies: 3,
      notes: null,
      status: 'entregado' as const,
      submitted_by: 'p-1',
      submitted_at: new Date().toISOString(),
      confirmed_at: null,
    };

    vi.mocked(reportsService.submitReport).mockResolvedValue({
      data: mockReport,
      error: null,
    });

    const { result } = renderHook(() => useMonthlyReport());

    let success = false;
    await act(async () => {
      success = await result.current.submitReport(
        {
          participated: true,
          hours: 12,
          bible_studies: 3,
          notes: '',
        },
        {
          profileId: 'p-1',
          serviceGroupId: 'g-1',
          month: 10,
          year: 2024,
        }
      );
    });

    expect(success).toBe(true);
    expect(result.current.submitSuccess).toBe(true);
    expect(result.current.savedReport).toEqual(mockReport);
    expect(result.current.error).toBeNull();
  });

  it('captura errores al fallar el servicio', async () => {
    vi.mocked(reportsService.submitReport).mockResolvedValue({
      data: null,
      error: 'Error de conexión',
    });

    const { result } = renderHook(() => useMonthlyReport());

    let success = false;
    await act(async () => {
      success = await result.current.submitReport(
        {
          participated: true,
          hours: 10,
          bible_studies: 1,
        },
        {
          profileId: 'p-1',
          serviceGroupId: 'g-1',
          month: 10,
          year: 2024,
        }
      );
    });

    expect(success).toBe(false);
    expect(result.current.submitSuccess).toBe(false);
    expect(result.current.error).toBe('Error de conexión');
  });
});
