import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

describe('AuthContext and useAuth', () => {
  it('inicializa con usuario predeterminado y permite cerrar sesión', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.full_name).toBe('David Morales');

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it('permite cambiar a usuario demo publicador', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAsDemo('publicador');
    });

    expect(result.current.user?.full_name).toBe('Mateo González');
    expect(result.current.user?.role).toBe('publicador');
  });

  it('permite cambiar a usuario demo encargado de grupo', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAsDemo('encargado');
    });

    expect(result.current.user?.full_name).toBe('Carlos Méndez');
    expect(result.current.user?.service_group_id).toBe('group-1');
  });
});
