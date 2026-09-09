# 2. Arquitectura General del Sistema

## 2.1 Visión Arquitectónica de Alto Nivel
La arquitectura del sistema sigue el patrón **Modern Client-Side Architecture (JAMstack / SPA)** con sincronización Backend-as-a-Service (BaaS) apoyada en **Supabase** y almacenamiento en caché de cliente mediante **Service Worker**.

```mermaid
graph TD
    subgraph Cliente Web & Móvil (Browser / PWA)
        UI["Capa de Presentación<br>(React 18 + Tailwind CSS)"]
        ATOMIC["Diseño Atómico<br>(Atoms / Molecules / Organisms / Templates)"]
        STATE["Capa de Estado y Lógica<br>(Custom Hooks + AuthContext + Memory Cache)"]
        SW["Service Worker Cache<br>(stale-while-revalidate / Offline Storage)"]
        SERVICES["Servicios de Dominio<br>(publishersService, reportsService, etc.)"]
    end

    subgraph Capa de Red y Protocolo
        HTTPS["HTTPS REST / WebSockets"]
        CLIENT["Supabase Client JS (@supabase/supabase-js)"]
    end

    subgraph Backend Cloud (Supabase / PostgreSQL 15)
        POSTGREST["PostgREST API Engine"]
        AUTH["Supabase Auth (GoTrue)"]
        RLS["Políticas Row-Level Security (RLS)<br>(3 Niveles de Permisos)"]
        DB[(Base de Datos PostgreSQL<br>Tables, Enums, Triggers, Functions)]
    end

    UI --> ATOMIC
    ATOMIC --> STATE
    STATE --> SERVICES
    SERVICES --> CLIENT
    CLIENT --> HTTPS
    HTTPS --> POSTGREST
    HTTPS --> AUTH
    POSTGREST --> RLS
    RLS --> DB
    SW -.->|Fallback Offline| UI
```

## 2.2 Flujo de Autenticación y Control de Sesión
El sistema soporta autenticación mediante sesiones JWT administradas por Supabase Auth, complementadas con un modo de desarrollo y prueba reactivo con usuarios pre-configurados.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Publicador / Encargado / Secretario
    participant Login as LoginPage (React)
    participant AuthCtx as AuthContext
    participant Storage as LocalStorage / Memory
    participant Supa as Supabase Auth

    Usuario->>Login: Ingresa credenciales o selecciona Usuario de Prueba
    Login->>AuthCtx: login(email, password) / demoLogin(role)
    alt Entorno Supabase Conectado
        AuthCtx->>Supa: signInWithPassword({ email, password })
        Supa-->>AuthCtx: AuthSession { user, access_token }
        AuthCtx->>Supa: from('profiles').select('*').eq('id', user.id)
        Supa-->>AuthCtx: Profile { role, privilege, service_group_id }
    else Modo Offline / Demo Local
        AuthCtx->>AuthCtx: Carga perfil simulado (David Morales / Carlos Méndez / Mateo González)
    end
    AuthCtx->>Storage: Persiste estado de sesión
    AuthCtx-->>Login: Usuario autenticado con rol y permisos
    Login-->>Usuario: Redirección automática según rol teocrático
```

## 2.3 Flujo de Creación y Entrega del Informe Mensual
```mermaid
sequenceDiagram
    autonumber
    actor Pub as Publicador
    participant Page as MonthlyReportPage
    participant Hook as useMonthlyReport
    participant Schema as Zod Validator
    participant Service as reportsService
    participant DB as PostgreSQL (monthly_reports)

    Pub->>Page: Abre "Mi Informe Mensual"
    Page->>Hook: useMonthlyReport()
    Hook-->>Page: Carga estado de informe previo (Borrador o Vacío)
    Pub->>Page: Ingresa Horas, Estudios y Notas
    Pub->>Page: Pulsa "Enviar Informe a la Congregación"
    Page->>Schema: validate(monthlyReportSchema)
    alt Datos Inválidos
        Schema-->>Page: Errores de validación (ej. horas negativas)
        Page-->>Pub: Muestra alerta descriptiva
    else Validación Exitosa
        Page->>Service: submitReport(reportData)
        Service->>DB: INSERT / UPDATE monthly_reports SET status='submitted'
        DB-->>Service: Registro actualizado con timestamp
        Service-->>Page: Confirmación de envío
        Page-->>Pub: Toast de éxito y bloqueo de campos editables
    end
```

## 2.4 Flujo de Registro Asistido por el Encargado de Grupo
```mermaid
sequenceDiagram
    autonumber
    actor Encargado as Encargado de Grupo
    participant UI as ServiceGroupsPage
    participant Modal as AssistedReportModal
    participant Hook as useServiceGroups
    participant DB as PostgreSQL

    Encargado->>UI: Identifica publicador con estado "Pendiente"
    Encargado->>UI: Clic en "Registro Asistido"
    UI->>Modal: Abre modal con datos del publicador
    Encargado->>Modal: Ingresa participación, horas y estudios
    Encargado->>Modal: Pulsa "Confirmar y Guardar"
    Modal->>Hook: registerAssistedReport(publisherId, reportData)
    Hook->>DB: UPDATE monthly_reports SET status='confirmed', submitted_by=encargado_id
    DB-->>Hook: Registro guardado
    Hook-->>UI: Actualiza conteo y marca publicador como "Entregado"
    UI-->>Encargado: Feedback visual inmediato
```

## 2.5 Flujo de Cierre de Mes Congregacional
```mermaid
sequenceDiagram
    autonumber
    actor Sec as Secretario
    participant Dash as DashboardPage
    participant Modal as MonthClosingModal
    participant Branch as BranchReportSummaryModal
    participant DB as PostgreSQL

    Sec->>Dash: Observa 100% o fecha límite alcanzada
    Sec->>Dash: Clic en "Cerrar Mes"
    Dash->>Modal: Despliega modal de cierre de ciclo
    Sec->>Modal: Marca Checklist: 1. Informes verificados
    Sec->>Modal: Marca Checklist: 2. Informe enviado a Sucursal
    Sec->>Modal: Marca Checklist: 3. Archivo S-21 actualizado
    Modal-->>Sec: Habilita botón "Confirmar y Cerrar Mes Oficialmente"
    Sec->>Modal: Clic en Confirmar Cierre
    Modal->>DB: Transición de mes activo (Octubre -> Noviembre)
    Modal->>DB: Bloqueo de edición de informes del período cerrado
    Modal-->>Dash: Notificación de cierre exitoso y actualización de vista
```

## 2.6 Diagrama de Despliegue en Producción
```mermaid
graph LR
    subgraph CDN & Edge Layer
        CLIENT_APP["PWA Static Assets<br>(HTML, JS, CSS, Webmanifest)<br>Servido en Edge CDN / Vercel / Netlify"]
    end

    subgraph Backend Services
        SB_AUTH["Supabase Auth Service<br>(JWT Tokens)"]
        SB_REST["PostgREST Service<br>(Auto-generated REST API)"]
    end

    subgraph Persistence Layer
        PG_DB[(PostgreSQL 15 Cluster<br>AWS Frankfurt / Sao Paulo)]
        PG_REPLICA[(Read Replica & Daily Backups)]
    end

    CLIENT_APP -->|HTTPS / WSS| SB_AUTH
    CLIENT_APP -->|HTTPS REST| SB_REST
    SB_AUTH --> PG_DB
    SB_REST --> PG_DB
    PG_DB -.->|WAL Replication| PG_REPLICA
```
