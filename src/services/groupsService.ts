import { supabase } from './supabaseClient';
import type {
  ServiceGroup,
  Profile,
  ServiceGroupInsert,
  ServiceGroupUpdate,
} from '@/types/database.types';
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
      const message =
        err instanceof Error ? err.message : 'Error al obtener los grupos de servicio';
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
      const message =
        err instanceof Error ? err.message : 'Error al obtener los publicadores del grupo';
      return { data: null, error: message };
    }
  },

  /**
   * Crea un nuevo grupo de servicio
   */
  async createGroup(group: ServiceGroupInsert): Promise<ServiceResult<ServiceGroup>> {
    try {
      const { data, error } = await supabase
        .from('service_groups')
        .insert(group)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear el grupo de servicio';
      return { data: null, error: message };
    }
  },

  /**
   * Modifica un grupo de servicio existente
   */
  async updateGroup(
    id: string,
    updates: ServiceGroupUpdate
  ): Promise<ServiceResult<ServiceGroup>> {
    try {
      const { data, error } = await supabase
        .from('service_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar el grupo de servicio';
      return { data: null, error: message };
    }
  },

  /**
   * Elimina un grupo de servicio, transfiriendo previamente sus publicadores
   * a un grupo de respaldo si se especifica.
   */
  async deleteGroup(
    id: string,
    fallbackGroupId?: string
  ): Promise<ServiceResult<boolean>> {
    try {
      if (fallbackGroupId) {
        // Reasignar publicadores al nuevo grupo
        const { error: transferError } = await supabase
          .from('profiles')
          .update({ service_group_id: fallbackGroupId })
          .eq('service_group_id', id);

        if (transferError) {
          return {
            data: false,
            error: `Error al transferir publicadores: ${transferError.message}`,
          };
        }
      }

      const { error: deleteError } = await supabase
        .from('service_groups')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return { data: false, error: deleteError.message };
      }

      return { data: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar el grupo de servicio';
      return { data: false, error: message };
    }
  },
};
