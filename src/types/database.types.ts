export type PublisherRole = 'secretario' | 'anciano' | 'siervo_ministerial' | 'publicador';
export type ServicePrivilege = 'publicador' | 'precursor_auxiliar' | 'precursor_regular';
export type ReportStatus = 'borrador' | 'entregado' | 'confirmado';

export type CongregationConfig = {
  id: string;
  congregation_name: string;
  circuit: string | null;
  active_service_year: string;
  active_month: number;
  active_year: number;
  monthly_deadline_day: number;
  updated_at: string;
};

export type ServiceGroup = {
  id: string;
  group_number: number;
  name: string;
  meeting_location: string | null;
  meeting_schedule: string | null;
  overseer_id: string | null;
  assistant_id: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  service_group_id: string | null;
  full_name: string;
  phone: string | null;
  role: PublisherRole;
  privilege: ServicePrivilege;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MonthlyReport = {
  id: string;
  profile_id: string;
  service_group_id: string;
  month: number;
  year: number;
  participated: boolean;
  hours: number;
  bible_studies: number;
  notes: string | null;
  status: ReportStatus;
  submitted_by: string | null;
  submitted_at: string;
  confirmed_at: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'alta';
  location_note: string | null;
  date_note: string | null;
  created_by: string | null;
  created_at: string;
};

export type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

/**
 * Esquema tipado para el cliente de Supabase
 */
export type Database = {
  public: {
    Tables: {
      congregation_config: {
        Row: CongregationConfig;
        Insert: Partial<Omit<CongregationConfig, 'id' | 'updated_at'>> & { congregation_name: string };
        Update: Partial<CongregationConfig>;
        Relationships: GenericRelationship[];
      };
      service_groups: {
        Row: ServiceGroup;
        Insert: Omit<ServiceGroup, 'id' | 'created_at'>;
        Update: Partial<ServiceGroup>;
        Relationships: GenericRelationship[];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
        Relationships: GenericRelationship[];
      };
      monthly_reports: {
        Row: MonthlyReport;
        Insert: Omit<MonthlyReport, 'id' | 'submitted_at'> & {
          submitted_at?: string;
          submitted_by?: string | null;
          confirmed_at?: string | null;
          notes?: string | null;
        };
        Update: Partial<MonthlyReport>;
        Relationships: GenericRelationship[];
      };
      announcements: {
        Row: Announcement;
        Insert: Omit<Announcement, 'id' | 'created_at'>;
        Update: Partial<Announcement>;
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin_or_elder: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_group_overseer: {
        Args: { group_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      publisher_role: PublisherRole;
      service_privilege: ServicePrivilege;
      report_status: ReportStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
