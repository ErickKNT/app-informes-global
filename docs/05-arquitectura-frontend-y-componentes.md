# 5. Arquitectura Frontend y Catálogo de Componentes

## 5.1 Filosofía de Diseño: Atomic Design
La interfaz se estructura siguiendo rigurosamente la metodología de **Atomic Design** de Brad Frost, dividida en cinco niveles jerárquicos:

1. **Átomos (`src/components/atoms/`):** Unidades básicas de construcción que no pueden descomponerse sin perder su significado interactivo.
2. **Moléculas (`src/components/molecules/`):** Combinaciones funcionales de átomos que operan como una unidad simple.
3. **Organismos (`src/components/organisms/`):** Secciones complejas de la interfaz compuestas por moléculas y átomos, dotadas de lógica de negocio y comportamiento interactivo.
4. **Plantillas (`src/components/templates/`):** Estructuras que disponen los organismos en una maquetación coherente (Layouts).
5. **Páginas (`src/pages/`):** Instancias específicas donde se inyectan datos del dominio teocrático en las plantillas.

---

## 5.2 Catálogo de Átomos
| Componente | Ubicación | Responsabilidad | Props Principales | Tests Asociados |
|---|---|---|---|---|
| **Avatar** | `atoms/Avatar` | Muestra iniciales estilizadas o imagen de perfil con tamaños adaptativos (`sm`, `md`, `lg`) | `name: string`, `imageUrl?: string`, `size?: 'sm' | 'md' | 'lg'` | `Avatar.test.tsx` (3 tests) |
| **Badge** | `atoms/Badge` | Etiqueta de estado para roles, nombramientos teocráticos y alertas con variantes de color | `variant: 'publicador' | 'precursor_regular' | 'precursor_auxiliar' | 'anciano' | 'siervo_ministerial' | 'active' | 'inactive'`, `children` | `Badge.test.tsx` (4 tests) |
| **Button** | `atoms/Button` | Elemento interactivo accesible con soporte para estados de carga, variantes visuales y tamaños | `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`, `size?: 'sm' | 'md' | 'lg'`, `isLoading?: boolean`, `disabled?: boolean` | `Button.test.tsx` (4 tests) |
| **Checkbox** | `atoms/Checkbox` | Control booleano estilizado con soporte de teclado y accesibilidad ARIA | `checked: boolean`, `onChange: (val: boolean) => void`, `label?: string`, `disabled?: boolean` | `Checkbox.test.tsx` (3 tests) |
| **Input** | `atoms/Input` | Campo de entrada de texto o números con soporte para íconos prefijo/sufijo y estados de error | `type?: string`, `value: string | number`, `error?: string`, `icon?: ReactNode` | `Input.test.tsx` (5 tests) |
| **Select** | `atoms/Select` | Menú desplegable nativo estilizado con opciones teocráticas y soporte de teclado | `options: Array<{ value: string; label: string }>`, `value: string`, `onChange: (val: string) => void` | `Select.test.tsx` (5 tests) |

---

## 5.3 Catálogo de Moléculas
| Componente | Ubicación | Responsabilidad | Dependencias de Átomos | Tests Asociados |
|---|---|---|---|---|
| **AlertBanner** | `molecules/AlertBanner` | Notificación superior destacada que advierte los días restantes para el cierre mensual (día 6) | `Button` | `AlertBanner.test.tsx` (2 tests) |
| **FormField** | `molecules/FormField` | Envoltorio accesible que agrupa etiqueta, campo de entrada (`Input`) y mensaje de error | `Input` | `FormField.test.tsx` (3 tests) |
| **RoleSelectorPill**| `molecules/RoleSelectorPill` | Selector tipo píldora para alternar el privilegio de servicio del informe (Publicador / Auxiliar / Regular) | `Badge`, `Button` | `RoleSelectorPill.test.tsx` (3 tests) |
| **SearchBar** | `molecules/SearchBar` | Campo de búsqueda con icono de lupa, botón de limpiar y evento con debounce | `Input` | `SearchBar.test.tsx` (3 tests) |
| **Sparkline** | `molecules/Sparkline` | Visualización SVG compacta de tendencia histórica en línea continua | Ninguno (SVG nativo) | `Sparkline.test.tsx` (3 tests) |

---

## 5.4 Catálogo de Organismos Principales
| Organismo | Ubicación | Responsabilidad de Negocio | Tests Asociados |
|---|---|---|---|
| **AnnouncementsBoard** | `organisms/AnnouncementsBoard` | Tablón oficial de anuncios con soporte para niveles de prioridad (`alta`, `normal`), fechas y creación/eliminación modal para ancianos | `AnnouncementsBoard.test.tsx` (3 tests) |
| **BranchReportSummaryModal** | `organisms/BranchReportSummaryModal` | Modal con el formato canónico **S-1** para la Sucursal con botón de copia al portapapeles en 1 clic e impresión | `BranchReportSummaryModal.test.tsx` (3 tests) |
| **MonthClosingModal** | `organisms/MonthClosingModal` | Modal con lista de verificación de 3 puntos obligatorios para cerrar formalmente el mes activo | `MonthClosingModal.test.tsx` (2 tests) |
| **PublisherImportModal** | `organisms/PublisherImportModal` | Modal para importar publicadores desde CSV con auto-detección de delimitadores, descarga de plantilla y tabla previa | `PublisherImportModal.test.tsx` (5 tests) |
| **WhatsAppReminderModal** | `organisms/WhatsAppReminderModal` | Centro de recordatorios por WhatsApp con personalización teocrática automática y modo de prueba interactivo | `WhatsAppReminderModal.test.tsx` (4 tests) |
| **PublisherCardS21View** | `organisms/PublisherCardS21View` | Renderizado completo de la tarjeta S-21 teocrática individual con cuadrícula de 12 meses y totales anuales | `PublisherCardS21View.test.tsx` (3 tests) |
| **AssistedReportModal** | `organisms/AssistedReportModal` | Formulario que permite al encargado registrar el informe de un publicador que lo entregó fuera de línea | `AssistedReportModal.test.tsx` (4 tests) |
| **MeetingAttendance** | `organisms/MeetingAttendance` | Módulo integral con tabla histórica, tarjetas de promedio y modal para registrar asistencia a reuniones | `MeetingAttendancePage.test.tsx` |
| **CongregationKPIs** | `organisms/CongregationKPIs` | Cuadrícula con métricas globales: Total horas, publicadores activos, estudios bíblicos y precursores | `CongregationKPIs.test.tsx` (1 test) |
| **GroupsOverviewTable** | `organisms/GroupsOverviewTable` | Tabla resumen que desglosa el cumplimiento de informes por cada uno de los grupos de servicio | `GroupsOverviewTable.test.tsx` (3 tests) |
| **RegularPioneersGoalCard**| `organisms/RegularPioneersGoalCard` | Seguimiento de la meta de 600 horas anuales para precursores regulares con cálculo de déficit y proyección | `RegularPioneersGoalCard.test.tsx` (3 tests) |
| **S21ConsolidatedTable** | `organisms/S21ConsolidatedTable` | Tabla consolidada S-21-S que archiva los totales mes a mes del año teocrático | `S21ConsolidatedTable.test.tsx` (2 tests) |

---

## 5.5 Plantilla Maestra (`AppLayout`)
La plantilla `AppLayout` encapsula:
- **Barra lateral de navegación (Sidebar):** Permanece fija en pantallas de escritorio (`lg:`), mostrando el logotipo teocrático (`Building2`), los accesos autorizados según el rol del usuario, y la tarjeta de perfil con botón de cerrar sesión.
- **Header móvil:** Barra superior responsiva con botón tipo hamburguesa que abre un cajón de navegación lateral animado en teléfonos móviles y tablets.
- **Área de Contenido:** Contenedor fluido con padding óptimo para dispositivos móviles y pantallas panorámicas.
