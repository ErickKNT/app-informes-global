# 4. Estructura del Proyecto y Reglas Arquitectónicas

## 4.1 Árbol de Directorios del Repositorio
```
App_informes/
├── .env.example                     # Plantilla documentada de variables de entorno públicas
├── .env.local                       # Variables de entorno locales (gitignored)
├── .gitignore                       # Configuración de exclusión de Git (node_modules, dist, *.log)
├── index.html                       # Documento raíz HTML con viewport y metadatos PWA
├── package.json                     # Definición de dependencias, scripts de build y pruebas
├── package-lock.json                # Árbol exacto de versiones de dependencias resueltas
├── postcss.config.js                # Configuración de procesadores CSS (Tailwind + Autoprefixer)
├── README.md                        # Documentación general y guía rápida
├── supabase_schema.sql              # Script SQL maestro (DDL, Enums, RLS, Triggers y Seeds)
├── tailwind.config.js               # Tokens de diseño teocrático, colores y tipografías
├── tsconfig.json                    # Configuración unificada de compilación TypeScript
├── vite.config.ts                   # Configuración del servidor de desarrollo, alias y Vitest
├── public/                          # Recursos estáticos servidos directamente en la raíz
│   ├── favicon.svg                  # Ícono SVG del Salón del Reino institucional (sin cruces)
│   ├── manifest.webmanifest         # Manifiesto de PWA para instalación móvil y de escritorio
│   └── sw.js                        # Service Worker para caché y soporte offline
├── docs/                            # Documentación técnica maestra y manuales de ingeniería
└── src/                             # Código fuente de la aplicación frontend
    ├── App.tsx                      # Componente raíz con enrutamiento declarativo y AuthProvider
    ├── App.test.tsx                 # Pruebas de integración del flujo de navegación y sesión
    ├── index.css                    # Directivas de Tailwind CSS y variables de diseño teocrático
    ├── main.tsx                     # Punto de entrada React 18 con registro de Service Worker
    ├── setupTests.ts                # Inicialización global de Jest-DOM para Vitest
    ├── vite-env.d.ts                # Declaraciones de tipos para variables de entorno de Vite
    ├── contexts/                    # Proveedores de contexto global de React
    │   ├── AuthContext.tsx          # Gestión de sesión, roles (3 niveles) y persistencia
    │   ├── AuthContext.test.tsx     # Pruebas unitarias de inicio y cierre de sesión
    │   └── index.ts                 # Barril de exportación
    ├── types/                       # Definición de interfaces y tipos TypeScript de base de datos
    │   └── database.types.ts        # Tipado fiel al esquema PostgreSQL de Supabase
    ├── schemas/                     # Esquemas de validación en tiempo de ejecución (Runtime)
    │   ├── monthlyReportSchema.ts   # Esquema Zod para validación de horas y estudios
    │   └── monthlyReportSchema.test.ts # Pruebas exhaustivas de reglas de informe
    ├── utils/                       # Funciones utilitarias globales
    │   ├── cn.ts                    # Composición condicional de clases con clsx y tailwind-merge
    │   └── cn.test.ts               # Pruebas unitarias de fusión de clases
    ├── services/                    # Capa de acceso a datos y comunicación con Supabase
    │   ├── supabaseClient.ts        # Instancia única del cliente Supabase JS
    │   ├── publishersService.ts     # CRUD de publicadores y cálculo de tarjeta S-21
    │   ├── publishersService.test.ts# Pruebas de servicio de publicadores
    │   ├── reportsService.ts        # Envío y confirmación de informes mensuales
    │   ├── reportsService.test.ts   # Pruebas de servicio de informes
    │   ├── groupsService.ts         # Gestión de grupos de servicio de predicación
    │   ├── groupsService.test.ts    # Pruebas de servicio de grupos
    │   ├── attendanceService.ts     # Registro y promedios de asistencia a reuniones
    │   ├── attendanceService.test.ts# Pruebas de servicio de asistencia
    │   ├── announcementsService.ts  # Publicación y consulta de avisos congregacionales
    │   ├── announcementsService.test.ts # Pruebas de servicio de anuncios
    │   ├── csvImportService.ts      # Parser y validación de archivos CSV de publicadores
    │   ├── csvImportService.test.ts # Pruebas de importación de CSV
    │   ├── exportService.ts         # Exportación estructurada a PDF y hojas de cálculo
    │   ├── exportService.test.ts    # Pruebas de exportación
    │   ├── whatsappReminderService.ts # Generador de mensajes con formato teocrático
    │   ├── whatsappReminderService.test.ts # Pruebas de recordatorios
    │   └── index.ts                 # Barril de exportación
    ├── hooks/                       # Custom hooks para encapsular lógica de estado y efectos
    │   ├── useMonthlyReport.ts      # Estado del informe personal y validación
    │   ├── useMonthlyReport.test.ts # Pruebas del hook de informe
    │   ├── useServiceGroups.ts      # Lógica de grupos, informes asistidos y métricas
    │   ├── useServiceGroups.test.ts # Pruebas del hook de grupos
    │   ├── usePublisherManagement.ts# Filtros, búsqueda, bajas y transferencias S-21
    │   ├── usePublisherManagement.test.ts # Pruebas del hook de administración
    │   ├── useMeetingAttendance.ts  # Registro de asistencia y promedios semanales
    │   ├── useMeetingAttendance.test.ts # Pruebas del hook de asistencia
    │   └── index.ts                 # Barril de exportación
    ├── pages/                       # Vistas principales de pantalla completa
    │   ├── LoginPage/               # Pantalla de acceso y selección de credenciales
    │   ├── DashboardPage/           # Panel de control central con KPIs y anuncios
    │   ├── MonthlyReportPage/       # Formulario personal para envío de informe mensual
    │   ├── ServiceGroupsPage/       # Supervisión de grupos y registro asistido
    │   ├── MeetingAttendancePage/   # Control semanal y mensual de asistencia
    │   ├── ConsolidatedReportsPage/ # Reportes S-21-S y resumen para la Sucursal S-1
    │   └── PublisherCardsPage/      # Tarjetas S-21 individuales e importador CSV
    └── components/                  # Arquitectura de componentes según Atomic Design
        ├── atoms/                   # Elementos indivisibles de UI
        │   ├── Avatar/              # Iniciales y foto de perfil
        │   ├── Badge/               # Etiquetas de rol, nombramiento y estado
        │   ├── Button/              # Botón accesible con variantes primario/secundario/peligro
        │   ├── Checkbox/            # Selector booleano accesible
        │   ├── Input/               # Entrada de texto y números con accesibilidad
        │   └── Select/              # Selector desplegable estilizado
        ├── molecules/               # Composiciones de átomos
        │   ├── AlertBanner/         # Alerta destacada con fecha límite de entrega
        │   ├── FormField/           # Etiqueta + Input + Mensaje de error
        │   ├── RoleSelectorPill/    # Píldora para alternar privilegios de predicación
        │   ├── SearchBar/           # Buscador interactivo con debounce
        │   └── Sparkline/           # Gráfica SVG compacta de tendencia
        ├── organisms/               # Componentes complejos con lógica de negocio
        │   ├── AnnouncementsBoard/  # Tablón de comunicados con creación y eliminación
        │   ├── AssistedReportModal/ # Modal para registrar informes a nombre de otros
        │   ├── BranchReportSummaryModal/ # Modal oficial del informe S-1 para la Sucursal
        │   ├── CongregationKPIs/    # Tarjetas maestras de métricas congregacionales
        │   ├── ConsolidatedMetricsSummary/ # Resumen anual acumulado de horas y estudios
        │   ├── DeleteGroupModal/    # Modal de confirmación con reasignación de publicadores
        │   ├── GroupFormModal/      # Formulario para crear y editar grupos de predicación
        │   ├── GroupMetricsCards/   # Indicadores específicos del grupo seleccionado
        │   ├── GroupSupervisorsCard/# Ficha del superintendente y auxiliar de grupo
        │   ├── GroupsOverviewTable/ # Tabla general del estado de grupos
        │   ├── HistoricalComparativeChart/ # Gráfica histórica de barras por año de servicio
        │   ├── HoursGaugeCard/      # Medidor circular de cumplimiento de horas
        │   ├── MeetingAttendance/   # Tablas y modales de asistencia a reuniones
        │   ├── MonthClosingModal/   # Modal de cierre mensual con checklist
        │   ├── PastoralAlertsCard/  # Alertas para atención de publicadores inactivos
        │   ├── PublisherCardS21View/# Vista canónica de la tarjeta de publicador S-21
        │   ├── PublisherFormModal/  # Modal de alta y edición de publicador
        │   ├── PublisherImportModal/# Modal para carga masiva de publicadores en CSV
        │   ├── PublisherTransferModal/# Modal de cambio de grupo de servicio
        │   ├── PublishersTable/     # Lista interactiva de publicadores con filtros
        │   ├── RegularPioneersGoalCard/ # Control de la meta de 600 horas para precursores
        │   ├── ReportSubmissionForm/# Formulario reactivo de entrega de informe
        │   ├── S21ConsolidatedTable/# Tabla consolidada anual de la secretaría
        │   └── WhatsAppReminderModal/# Modal interactivo para mensajes de WhatsApp
        └── templates/               # Estructuras de maquetación y layouts
            └── AppLayout/           # Layout maestro con navegación lateral y header móvil
```

## 4.2 Reglas de Importación entre Capas
Para garantizar el bajo acoplamiento y la alta cohesión, se establecen las siguientes reglas arquitectónicas:

1. **Flujo Unidireccional de Capas:**
   - `pages/` puede importar `components/`, `hooks/`, `types/`, `utils/`.
   - `components/organisms/` puede importar `molecules/`, `atoms/`, `types/`, `utils/` y `services/` si requiere acciones puntuales.
   - `components/molecules/` solo puede importar `atoms/`, `types/`, `utils/`.
   - `components/atoms/` NO puede importar otras capas de componentes (es el nivel base).
2. **Desacoplamiento de Base de Datos:**
   - Ningún componente de presentación debe ejecutar consultas directas a Supabase (`supabase.from(...)`). Toda interacción con la red debe canalizarse exclusivamente a través de la capa `src/services/` o mediante Custom Hooks en `src/hooks/`.
3. **Validaciones en el Frontend:**
   - Los datos ingresados por el usuario deben validarse en tiempo de ejecución con esquemas Zod (`src/schemas/`) antes de enviarse a los servicios.
