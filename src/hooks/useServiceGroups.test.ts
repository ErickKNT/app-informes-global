import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useServiceGroups } from './useServiceGroups';

describe('useServiceGroups custom hook', () => {
  it('inicializa con el grupo activo por defecto y permite cambiar de grupo', () => {
    const { result } = renderHook(() => useServiceGroups());

    expect(result.current.activeGroupId).toBe('group-1');
    expect(result.current.activeGroup.name).toBe('Grupo 1 - Los Olivos');

    act(() => {
      result.current.setActiveGroupId('group-2');
    });

    expect(result.current.activeGroupId).toBe('group-2');
    expect(result.current.activeGroup.name).toBe('Grupo 2 - Betel');
  });

  it('actualiza el publicador y las métricas al registrar un informe asistido', () => {
    const { result } = renderHook(() => useServiceGroups());

    const pendingPublisher = result.current.activeGroup.publishers.find(
      (p) => !p.hasReported
    );
    expect(pendingPublisher).toBeDefined();

    act(() => {
      result.current.recordAssistedReport(pendingPublisher!.id, {
        hours: 18,
        bibleStudies: 2,
      });
    });

    const updatedPublisher = result.current.activeGroup.publishers.find(
      (p) => p.id === pendingPublisher!.id
    );

    expect(updatedPublisher?.hasReported).toBe(true);
    expect(updatedPublisher?.hours).toBe(18);
    expect(updatedPublisher?.bibleStudies).toBe(2);
  });

  it('permite crear un nuevo grupo y lo selecciona como activo', () => {
    const { result } = renderHook(() => useServiceGroups());

    act(() => {
      result.current.createGroup(
        {
          group_number: 3,
          name: 'Grupo 3 - Sinaí',
          meeting_location: 'Calle Sinaí 8',
          meeting_schedule: 'Domingos 9:00 AM',
          overseer_id: null,
          assistant_id: null,
        },
        'Mateo Ramos',
        'Daniel Ortiz'
      );
    });

    expect(result.current.groups).toHaveLength(3);
    expect(result.current.activeGroup.name).toBe('Grupo 3 - Sinaí');
    expect(result.current.activeGroup.supervisors.overseer.name).toBe('Mateo Ramos');
  });

  it('elimina un grupo y transfiere sus publicadores al grupo de respaldo', () => {
    const { result } = renderHook(() => useServiceGroups());

    // Grupo 1 tiene 4 publicadores, Grupo 2 tiene 2 publicadores
    const initialGroup1Count = result.current.groups[0]?.publishers.length || 0;
    const initialGroup2Count = result.current.groups[1]?.publishers.length || 0;

    act(() => {
      // Eliminar grupo 1 transfiriendo a grupo 2
      result.current.deleteGroup('group-1', 'group-2');
    });

    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0]?.id).toBe('group-2');
    // Grupo 2 ahora tiene sus propios publicadores + los transferidos de grupo 1
    expect(result.current.groups[0]?.publishers.length).toBe(
      initialGroup1Count + initialGroup2Count
    );
  });
});
