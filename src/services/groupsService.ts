import { supabase } from './supabaseClient';
import type { ServiceGroup, Profile } from '@/types/database.types';
import type { ServiceResult } from './reportsService';

export const groupsService = {
  /**
   * Obtiene todos los grupos de servicio activos
   */
  async getServiceGroups(): Promise<ServiceResult<ServiceGroup[]>> {
    try {
      const { data, error } = await supabase
        .from('service_groups')
        .select('*')
        .order('group_number', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data ?? [], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener los grupos de servicio';
      return { data: null, error: message };
    }
  },

  /**
   * Obtiene los publicadores pertenecientes a un grupo
   */
  async getPublishersByGroup(groupId: string): Promise<ServiceResult<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('service_group_id', groupId)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data ?? [], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener los publicadores del grupo';
      return { data: null, error: message };
    }
  },
};
