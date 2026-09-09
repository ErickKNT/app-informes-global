import { supabase } from './supabaseClient';
import type { MonthlyReport, Database } from '@/types/database.types';

export type MonthlyReportInsert = Database['public']['Tables']['monthly_reports']['Insert'];

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export const reportsService = {
  /**
   * Envía o actualiza un informe mensual en Supabase
   */
  async submitReport(report: MonthlyReportInsert): Promise<ServiceResult<MonthlyReport>> {
    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .upsert(report, {
          onConflict: 'profile_id,month,year',
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar el informe mensual';
      return { data: null, error: message };
    }
  },

  /**
   * Obtiene los informes de un grupo de servicio para un mes y año específicos
   */
  async getReportsByGroup(
    serviceGroupId: string,
    month: number,
    year: number
  ): Promise<ServiceResult<MonthlyReport[]>> {
    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('service_group_id', serviceGroupId)
        .eq('month', month)
        .eq('year', year);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data ?? [], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener informes del grupo';
      return { data: null, error: message };
    }
  },

  /**
   * Obtiene todos los informes de un publicador para el año de servicio
   */
  async getPublisherReportsForYear(
    profileId: string,
    year: number
  ): Promise<ServiceResult<MonthlyReport[]>> {
    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('profile_id', profileId)
        .eq('year', year)
        .order('month', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data ?? [], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener informes del publicador';
      return { data: null, error: message };
    }
  },
};
