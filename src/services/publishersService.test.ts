import { describe, it, expect, vi } from 'vitest';
import { publishersService } from './publishersService';
import { supabase } from './supabaseClient';

vi.mock('./supabaseClient', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('publishersService', () => {
  it('obtiene la lista de publicadores y aplica filtros', async () => {
    const mockPublishers = [
      {
        id: 'pub-1',
        service_group_id: 'grp-1',
        full_name: 'Mateo González',
        phone: '+52 55 1234 5678',
        role: 'publicador' as const,
        privilege: 'precursor_regular' as const,
        is_active: true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'pub-2',
        service_group_id: 'grp-2',
        full_name: 'Lucas Peña',
        phone: '+52 55 9999 8888',
        role: 'publicador' as const,
        privilege: 'publicador' as const,
        is_active: true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockPublishers, error: null });
    const mockEq3 = vi.fn().mockReturnValue({ order: mockOrder });
    const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3, order: mockOrder });
    const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2, order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1, order: mockOrder });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await publishersService.getPublishers({
      search: 'mateo',
    });

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]?.full_name).toBe('Mateo González');
  });

  it('crea un nuevo publicador', async () => {
    const newPub = {
      id: 'pub-new',
      service_group_id: 'grp-1',
      full_name: 'Nuevo Hermano',
      phone: '+52 55 0000 1111',
      role: 'publicador' as const,
      privilege: 'publicador' as const,
      is_active: true,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockSingle = vi.fn().mockResolvedValue({ data: newPub, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await publishersService.createPublisher({
      service_group_id: 'grp-1',
      full_name: 'Nuevo Hermano',
      phone: '+52 55 0000 1111',
      role: 'publicador',
      privilege: 'publicador',
      is_active: true,
      avatar_url: null,
    });

    expect(result.error).toBeNull();
    expect(result.data?.full_name).toBe('Nuevo Hermano');
  });

  it('reasigna un publicador a otro grupo', async () => {
    const updatedPub = {
      id: 'pub-1',
      service_group_id: 'grp-3',
      full_name: 'Mateo González',
      phone: null,
      role: 'publicador' as const,
      privilege: 'precursor_regular' as const,
      is_active: true,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockSingle = vi.fn().mockResolvedValue({ data: updatedPub, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.from).mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await publishersService.reassignPublisherGroup('pub-1', 'grp-3');

    expect(result.error).toBeNull();
    expect(result.data?.service_group_id).toBe('grp-3');
  });
});
