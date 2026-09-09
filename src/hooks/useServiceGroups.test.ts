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
});
