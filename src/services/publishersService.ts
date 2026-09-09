import { supabase } from './supabaseClient';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  PublisherS21Card,
  PublisherMonthRecord,
  PublisherRole,
  ServicePrivilege,
} from '@/types/database.types';
import type { ServiceResult } from './reportsService';

export interface PublisherFilters {
  groupId?: string;
  role?: PublisherRole;
  privilege?: ServicePrivilege;
  search?: string;
  activeOnly?: boolean;
}

const MONTH_NAMES = [
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
];

export const publishersService = {
  /**
   * Obtiene la lista de publicadores con filtros opcionales
   */
  async getPublishers(filters?: PublisherFilters): Promise<ServiceResult<Profile[]>> {
    try {
      let query = supabase.from('profiles').select('*');

      if (filters?.activeOnly !== false) {
        query = query.eq('is_active', true);
      }

      if (filters?.groupId) {
        query = query.eq('service_group_id', filters.groupId);
      }

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.privilege) {
        query = query.eq('privilege', filters.privilege);
      }

      const { data, error } = await query.order('full_name', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      let result = data ?? [];

      if (filters?.search) {
        const queryLower = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.full_name.toLowerCase().includes(queryLower) ||
            (p.phone && p.phone.includes(queryLower))
        );
      }

      return { data: result, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener publicadores';
      return { data: null, error: message };
    }
  },

  /**
   * Obtiene un publicador por su ID
   */
  async getPublisherById(id: string): Promise<ServiceResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener el publicador';
      return { data: null, error: message };
    }
  },

  /**
   * Crea un nuevo publicador en la congregación
   */
  async createPublisher(profile: ProfileInsert): Promise<ServiceResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          is_active: profile.is_active ?? true,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar el publicador';
      return { data: null, error: message };
    }
  },

  /**
   * Actualiza los datos o el rol de un publicador
   */
  async updatePublisher(id: string, updates: ProfileUpdate): Promise<ServiceResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar los datos del publicador';
      return { data: null, error: message };
    }
  },

  /**
   * Reasigna un publicador a otro grupo de servicio
   */
  async reassignPublisherGroup(
    publisherId: string,
    newGroupId: string | null
  ): Promise<ServiceResult<Profile>> {
    return this.updatePublisher(publisherId, { service_group_id: newGroupId });
  },

  /**
   * Da de baja lógica a un publicador
   */
  async deactivatePublisher(id: string): Promise<ServiceResult<Profile>> {
    return this.updatePublisher(id, { is_active: false });
  },

  /**
   * Genera o consulta la tarjeta canónica individual S-21 con los 12 meses
   */
  async getPublisherS21Card(
    publisherId: string,
    serviceYear = '2024-2025'
  ): Promise<ServiceResult<PublisherS21Card>> {
    try {
      const pubResult = await this.getPublisherById(publisherId);
      if (pubResult.error || !pubResult.data) {
        return { data: null, error: pubResult.error || 'Publicador no encontrado' };
      }

      const publisher = pubResult.data;

      // Obtener el grupo si tiene asignación
      let serviceGroup = null;
      if (publisher.service_group_id) {
        const { data: grpData } = await supabase
          .from('service_groups')
          .select('*')
          .eq('id', publisher.service_group_id)
          .single();
        serviceGroup = grpData;
      }

      // Obtener los informes del año de servicio
      const startYear = parseInt(serviceYear.split('-')[0] || '2024', 10);
      const endYear = startYear + 1;

      const { data: reportsData } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('profile_id', publisherId);

      const reports = reportsData ?? [];

      // Mapear los 12 meses del año teocrático (Septiembre a Agosto)
      const serviceMonths = [
        { month: 9, year: startYear },
        { month: 10, year: startYear },
        { month: 11, year: startYear },
        { month: 12, year: startYear },
        { month: 1, year: endYear },
        { month: 2, year: endYear },
        { month: 3, year: endYear },
        { month: 4, year: endYear },
        { month: 5, year: endYear },
        { month: 6, year: endYear },
        { month: 7, year: endYear },
        { month: 8, year: endYear },
      ];

      const records: PublisherMonthRecord[] = serviceMonths.map((sm, index) => {
        const foundReport = reports.find(
          (r) => r.month === sm.month && r.year === sm.year
        );

        return {
          month: sm.month,
          year: sm.year,
          monthName: MONTH_NAMES[index] || `Mes ${sm.month}`,
          participated: foundReport?.participated ?? false,
          hours: foundReport?.hours ?? 0,
          bible_studies: foundReport?.bible_studies ?? 0,
          notes: foundReport?.notes ?? null,
          status: foundReport ? foundReport.status : 'no_entregado',
        };
      });

      const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
      const monthsReportedCount = records.filter((r) => r.status !== 'no_entregado').length;
      const averageHours =
        monthsReportedCount > 0
          ? Math.round((totalHours / monthsReportedCount) * 10) / 10
          : 0;
      const totalStudies = records.reduce((sum, r) => sum + r.bible_studies, 0);

      // Meta canónica anual
      let annualGoal = 0;
      if (publisher.privilege === 'precursor_regular') {
        annualGoal = 600;
      } else if (publisher.privilege === 'precursor_auxiliar') {
        annualGoal = 360;
      }

      const goalProgressPct =
        annualGoal > 0 ? Math.min(100, Math.round((totalHours / annualGoal) * 100)) : 100;

      return {
        data: {
          publisher,
          serviceGroup,
          serviceYear,
          records,
          totalHours,
          averageHours,
          totalStudies,
          annualGoal,
          goalProgressPct,
        },
        error: null,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al obtener la tarjeta S-21 del publicador';
      return { data: null, error: message };
    }
  },
};

