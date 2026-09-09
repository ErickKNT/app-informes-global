import { describe, it, expect, vi } from 'vitest';
import { reportsService } from './reportsService';
import { supabase } from './supabaseClient';

vi.mock('./supabaseClient', () => {
  const mockSingle = vi.fn();
  const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
  const mockUpsert = vi.fn().mockReturnValue({ select: mockSelect });
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockFrom = vi.fn().mockReturnValue({
    upsert: mockUpsert,
    select: mockSelect,
    eq: mockEq,
    order: mockOrder,
  });

  return {
    supabase: {
      from: mockFrom,
    },
  };
});

describe('reportsService Data Access Layer', () => {
  it('envía informe mensual correctamente llamando a upsert', async () => {
    const mockReportData = {
      id: 'rep-1',
      profile_id: 'prof-1',
      service_group_id: 'grp-1',
      month: 10,
      year: 2024,
      participated: true,
      hours: 15,
      bible_studies: 2,
      notes: 'Mes excelente',
      status: 'entregado' as const,
      submitted_by: 'prof-1',
      submitted_at: new Date().toISOString(),
      confirmed_at: null,
    };

    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: mockReportData, error: null }),
    });

    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await reportsService.submitReport({
      profile_id: 'prof-1',
      service_group_id: 'grp-1',
      month: 10,
      year: 2024,
      participated: true,
      hours: 15,
      bible_studies: 2,
      notes: 'Mes excelente',
      status: 'entregado',
      submitted_by: 'prof-1',
      confirmed_at: null,
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockReportData);
  });

  it('maneja errores retornados por Supabase elegantemente', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'RLS policy violation' },
      }),
    });

    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await reportsService.submitReport({
      profile_id: 'prof-1',
      service_group_id: 'grp-1',
      month: 10,
      year: 2024,
      participated: true,
      hours: 15,
      bible_studies: 2,
      notes: null,
      status: 'entregado',
      submitted_by: 'prof-1',
      confirmed_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('RLS policy violation');
  });
});
