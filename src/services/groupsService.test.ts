import { describe, it, expect, vi } from 'vitest';
import { groupsService } from './groupsService';
import { supabase } from './supabaseClient';

vi.mock('./supabaseClient', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('groupsService Data Access Layer', () => {
  it('obtiene grupos de servicio ordenados por group_number', async () => {
    const mockGroups = [
      {
        id: 'g-1',
        group_number: 1,
        name: 'Grupo 1 - Los Olivos',
        meeting_location: 'Calle Olivos 12',
        meeting_schedule: 'Sábados 9:00 AM',
        overseer_id: 'p-1',
        assistant_id: 'p-2',
        created_at: new Date().toISOString(),
      },
    ];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockGroups, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await groupsService.getServiceGroups();

    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockGroups);
  });

  it('retorna error cuando falla la consulta de grupos', async () => {
    const mockOrder = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Network error' },
    });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await groupsService.getServiceGroups();

    expect(result.data).toBeNull();
    expect(result.error).toBe('Network error');
  });
});
