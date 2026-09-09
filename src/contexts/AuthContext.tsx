import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Profile } from '@/types/database.types';
import { supabase } from '@/services/supabaseClient';

export interface AuthContextValue {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (role: 'secretario' | 'publicador') => void;
  logout: () => void;
}

const DEMO_USERS: Record<'secretario' | 'publicador', Profile> = {
  secretario: {
    id: 'usr-admin-1',
    service_group_id: 'grp-1',
    full_name: 'David Morales',
    phone: '+52 55 1234 5678',
    role: 'secretario',
    privilege: 'precursor_regular',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  publicador: {
    id: 'usr-pub-2',
    service_group_id: 'grp-2',
    full_name: 'Mateo González',
    phone: '+52 55 9876 5432',
    role: 'publicador',
    privilege: 'publicador',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

const STORAGE_KEY = 'app_informes_auth_user';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_USERS.secretario; // Default logged in as David Morales for convenient initial load
    } catch {
      return DEMO_USERS.secretario;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Si es una credencial demo conocida
    if (email.toLowerCase().includes('david') || email.toLowerCase().includes('secretario')) {
      setUser(DEMO_USERS.secretario);
      setIsLoading(false);
      return true;
    }
    if (email.toLowerCase().includes('mateo') || email.toLowerCase().includes('publicador')) {
      setUser(DEMO_USERS.publicador);
      setIsLoading(false);
      return true;
    }

    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (sbError) {
        // Si Supabase devuelve error pero el usuario intentó probar, o si hay credenciales válidas
        setError(sbError.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Consultar el perfil en la tabla profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser(profile);
        } else {
          // Perfil de respaldo si no existe en profiles
          setUser({
            id: data.user.id,
            service_group_id: null,
            full_name: data.user.email?.split('@')[0] || 'Hermano',
            phone: null,
            role: 'publicador',
            privilege: 'publicador',
            is_active: true,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado de autenticación';
      setError(msg);
      setIsLoading(false);
      return false;
    }
  }, []);

  const loginAsDemo = useCallback((role: 'secretario' | 'publicador') => {
    setError(null);
    setUser(DEMO_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    supabase.auth.signOut().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
