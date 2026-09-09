-- ==============================================================================
-- SISTEMA CONGREGACIONAL DE INFORMES Y REGISTRO S-21
-- Esquema Oficial de Base de Datos para Supabase (PostgreSQL)
-- Incluye Tablas, Claves Foráneas, Índices, Triggers y Políticas RLS
-- ==============================================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TIPOS ENUMERADOS
DO $$ BEGIN
    CREATE TYPE publisher_role AS ENUM ('secretario', 'anciano', 'siervo_ministerial', 'publicador');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE service_privilege AS ENUM ('publicador', 'precursor_auxiliar', 'precursor_regular');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('borrador', 'entregado', 'confirmado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE meeting_type AS ENUM ('entre_semana', 'fin_de_semana');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE announcement_priority AS ENUM ('normal', 'alta');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLA: CONFIGURACIÓN CONGREGACIONAL
CREATE TABLE IF NOT EXISTS public.congregation_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    congregation_name TEXT NOT NULL DEFAULT 'Congregación El Olivar',
    circuit TEXT DEFAULT 'Circuito 12',
    active_service_year TEXT NOT NULL DEFAULT 'Año de Servicio 2024-2025',
    active_month INTEGER NOT NULL DEFAULT 10,
    active_year INTEGER NOT NULL DEFAULT 2024,
    monthly_deadline_day INTEGER NOT NULL DEFAULT 6,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: GRUPOS DE SERVICIO
CREATE TABLE IF NOT EXISTS public.service_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_number INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    meeting_location TEXT,
    meeting_schedule TEXT,
    overseer_id UUID,
    assistant_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: PERFILES DE PUBLICADORES (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_group_id UUID REFERENCES public.service_groups(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role publisher_role NOT NULL DEFAULT 'publicador',
    privilege service_privilege NOT NULL DEFAULT 'publicador',
    is_active BOOLEAN NOT NULL DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla profiles ya existía previamente vinculada rígidamente a auth.users(id),
-- eliminamos la restricción de clave foránea externa para permitir registrar publicadores
-- locales y cargar datos semilla de la congregación sin exigir una cuenta en auth.users:
ALTER TABLE IF EXISTS public.profiles 
    DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Agregar columna user_id opcional si se desea vincular con auth.users
ALTER TABLE IF EXISTS public.profiles 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Agregar referencias de supervisores en service_groups hacia profiles
ALTER TABLE public.service_groups 
    DROP CONSTRAINT IF EXISTS fk_service_groups_overseer,
    ADD CONSTRAINT fk_service_groups_overseer FOREIGN KEY (overseer_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.service_groups 
    DROP CONSTRAINT IF EXISTS fk_service_groups_assistant,
    ADD CONSTRAINT fk_service_groups_assistant FOREIGN KEY (assistant_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. TABLA: INFORMES MENSUALES (MONTHLY_REPORTS)
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_group_id UUID NOT NULL REFERENCES public.service_groups(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    participated BOOLEAN NOT NULL DEFAULT true,
    hours INTEGER NOT NULL DEFAULT 0,
    bible_studies INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    status report_status NOT NULL DEFAULT 'entregado',
    submitted_by UUID REFERENCES public.profiles(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    CONSTRAINT unique_profile_month_year UNIQUE (profile_id, month, year)
);

-- 6. TABLA: ASISTENCIA A REUNIONES (MEETING_ATTENDANCE)
CREATE TABLE IF NOT EXISTS public.meeting_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    meeting_type meeting_type NOT NULL,
    attendance_count INTEGER NOT NULL CHECK (attendance_count >= 0),
    notes TEXT,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: ANUNCIOS CONGREGACIONALES (ANNOUNCEMENTS)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority announcement_priority NOT NULL DEFAULT 'normal',
    location_note TEXT,
    date_note TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_profiles_service_group ON public.profiles(service_group_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_lookup ON public.monthly_reports(month, year, service_group_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendance_month_year ON public.meeting_attendance(year, month);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

-- 9. TRIGGER PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_congregation_config_updated_at ON public.congregation_config;
CREATE TRIGGER set_congregation_config_updated_at
    BEFORE UPDATE ON public.congregation_config
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.congregation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura abierta para miembros autenticados
DROP POLICY IF EXISTS "Lectura congregación autorizada" ON public.congregation_config;
CREATE POLICY "Lectura congregación autorizada" ON public.congregation_config FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura grupos autorizada" ON public.service_groups;
CREATE POLICY "Lectura grupos autorizada" ON public.service_groups FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura perfiles autorizada" ON public.profiles;
CREATE POLICY "Lectura perfiles autorizada" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura asistencia autorizada" ON public.meeting_attendance;
CREATE POLICY "Lectura asistencia autorizada" ON public.meeting_attendance FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura anuncios autorizada" ON public.announcements;
CREATE POLICY "Lectura anuncios autorizada" ON public.announcements FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura reportes autorizada" ON public.monthly_reports;
CREATE POLICY "Lectura reportes autorizada" ON public.monthly_reports FOR SELECT TO authenticated USING (true);

-- Políticas de inserción y modificación de informes (El propio publicador, el encargado de su grupo o el secretario)
DROP POLICY IF EXISTS "Publicadores gestionan sus informes" ON public.monthly_reports;
CREATE POLICY "Publicadores gestionan sus informes" ON public.monthly_reports
    FOR ALL TO authenticated
    USING (auth.uid() = profile_id OR auth.uid() IN (
        SELECT id FROM public.profiles WHERE role IN ('secretario', 'anciano', 'siervo_ministerial')
    ));

-- Políticas de gestión total para Secretarios / Ancianos
DROP POLICY IF EXISTS "Secretario gestiona perfiles" ON public.profiles;
CREATE POLICY "Secretario gestiona perfiles" ON public.profiles
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'secretario'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'secretario'));

DROP POLICY IF EXISTS "Secretario gestiona grupos" ON public.service_groups;
CREATE POLICY "Secretario gestiona grupos" ON public.service_groups
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'secretario'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'secretario'));

DROP POLICY IF EXISTS "Ancianos gestionan asistencia" ON public.meeting_attendance;
CREATE POLICY "Ancianos gestionan asistencia" ON public.meeting_attendance
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('secretario', 'anciano')))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('secretario', 'anciano')));

DROP POLICY IF EXISTS "Ancianos gestionan anuncios" ON public.announcements;
CREATE POLICY "Ancianos gestionan anuncios" ON public.announcements
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('secretario', 'anciano')))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('secretario', 'anciano')));

-- 11. DATOS SEMILLA INICIALES (DEMO / ARRANQUE)
INSERT INTO public.congregation_config (congregation_name, circuit, active_service_year, active_month, active_year, monthly_deadline_day)
VALUES ('Congregación El Olivar', 'Circuito 12', 'Año de Servicio 2024-2025', 10, 2024, 6)
ON CONFLICT DO NOTHING;

-- Grupos de servicio iniciales
INSERT INTO public.service_groups (id, group_number, name, meeting_location, meeting_schedule)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 1, 'Grupo 1 - Los Olivos', 'Salón B · Zona Norte', 'Sábados 09:30 AM'),
    ('22222222-2222-2222-2222-222222222222', 2, 'Grupo 2 - Betel', 'Av. Primavera 405 (Salón Auxiliar B)', 'Sábados 09:30 AM'),
    ('33333333-3333-3333-3333-333333333333', 3, 'Grupo 3 - Sinaí', 'Calle Sinaí 8', 'Domingos 09:00 AM'),
    ('44444444-4444-4444-4444-444444444444', 4, 'Grupo 4 - Hermón', 'Av. Las Torres 112', 'Sábados 09:00 AM'),
    ('55555555-5555-5555-5555-555555555555', 5, 'Grupo 5 - Galilea', 'Calle Galilea 4', 'Sábados 09:30 AM')
ON CONFLICT (group_number) DO NOTHING;

-- Perfiles clave
INSERT INTO public.profiles (id, service_group_id, full_name, phone, role, privilege, is_active)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'David Morales', '+52 55 1234 5678', 'secretario', 'precursor_regular', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Carlos Méndez', '+34 612 889 012', 'anciano', 'precursor_regular', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Mateo González', '+52 55 9876 5432', 'publicador', 'publicador', true)
ON CONFLICT DO NOTHING;

-- Asignar supervisores a Grupo 1
UPDATE public.service_groups 
SET overseer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
WHERE group_number = 1;

