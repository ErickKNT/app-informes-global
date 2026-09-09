import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePublisherManagement } from './usePublisherManagement';

describe('usePublisherManagement custom hook', () => {
  it('inicializa con lista de publicadores y selecciona el primero por defecto', () => {
    const { result } = renderHook(() => usePublisherManagement());

    expect(result.current.publishers.length).toBeGreaterThan(0);
    expect(result.current.activePublisher?.full_name).toBe('Mateo González');
    expect(result.current.activeCard).not.toBeNull();
    expect(result.current.activeCard?.records).toHaveLength(12);
  });

  it('permite filtrar publicadores por texto de búsqueda', () => {
    const { result } = renderHook(() => usePublisherManagement());

    act(() => {
      result.current.setSearchQuery('Lucas');
    });

    expect(result.current.filteredPublishers).toHaveLength(1);
    expect(result.current.filteredPublishers[0]?.full_name).toBe('Lucas Peña');
  });

  it('permite crear un nuevo publicador y lo selecciona', () => {
    const { result } = renderHook(() => usePublisherManagement());

    act(() => {
      result.current.createPublisher({
        full_name: 'Santiago Morales',
        phone: '+52 55 9999 1111',
        role: 'siervo_ministerial',
        privilege: 'precursor_regular',
        service_group_id: 'grp-2',
      });
    });

    expect(result.current.activePublisher?.full_name).toBe('Santiago Morales');
    expect(result.current.activeCard?.annualGoal).toBe(600);
  });

  it('permite transferir un publicador a otro grupo', () => {
    const { result } = renderHook(() => usePublisherManagement());

    act(() => {
      result.current.transferPublisher('pub-1', 'grp-3');
    });

    const updatedPub = result.current.publishers.find((p) => p.id === 'pub-1');
    expect(updatedPub?.service_group_id).toBe('grp-3');
  });

  it('permite dar de baja lógica a un publicador', () => {
    const { result } = renderHook(() => usePublisherManagement());

    act(() => {
      result.current.deactivatePublisher('pub-1');
    });

    const deactivated = result.current.publishers.find((p) => p.id === 'pub-1');
    expect(deactivated?.is_active).toBe(false);

    // No debe aparecer en filteredPublishers
    expect(result.current.filteredPublishers.find((p) => p.id === 'pub-1')).toBeUndefined();
  });
});

