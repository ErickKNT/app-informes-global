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

  it('crea un nuevo grupo de servicio', async () => {
    const newGroup = {
      id: 'g-6',
      group_number: 6,
      name: 'Grupo 6 - Valle Dorado',
      meeting_location: 'Calle Dorado 45',
      meeting_schedule: 'Domingos 9:00 AM',
      overseer_id: null,
      assistant_id: null,
      created_at: new Date().toISOString(),
    };

    const mockSingle = vi.fn().mockResolvedValue({ data: newGroup, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await groupsService.createGroup({
      group_number: 6,
      name: 'Grupo 6 - Valle Dorado',
      meeting_location: 'Calle Dorado 45',
      meeting_schedule: 'Domingos 9:00 AM',
      overseer_id: null,
      assistant_id: null,
    });

    expect(result.error).toBeNull();
    expect(result.data?.name).toBe('Grupo 6 - Valle Dorado');
  });

  it('elimina un grupo transfiriendo publicadores al grupo de respaldo', async () => {
    const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });

    const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'profiles') {
        return { update: mockUpdate } as unknown as ReturnType<typeof supabase.from>;
      }
      return { delete: mockDelete } as unknown as ReturnType<typeof supabase.from>;
    });

    const result = await groupsService.deleteGroup('g-old', 'g-target');

    expect(result.error).toBeNull();
    expect(result.data).toBe(true);
  });
});

