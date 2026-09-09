# 15. Trazabilidad de Requisitos y Gestión de Riesgos

## 15.1 Matriz de Trazabilidad Integral (REQ -> Feature -> Componente -> Servicio -> DB -> Test)

| Requisito | Feature | Componente / UI | Hook / Servicio | Entidad en DB | Suite de Pruebas |
|---|---|---|---|---|---|
| **REQ-001** | Llenado de Informe Personal | `ReportSubmissionForm` en `MonthlyReportPage` | `useMonthlyReport` / `reportsService` | `public.monthly_reports` | `MonthlyReportPage.test.tsx`, `monthlyReportSchema.test.ts` |
| **REQ-002** | Registro Asistido para Encargados | `AssistedReportModal` en `ServiceGroupsPage` | `useServiceGroups` / `reportsService` | `public.monthly_reports` | `AssistedReportModal.test.tsx`, `ServiceGroupsPage.test.tsx` |
| **REQ-003** | Supervisión de Grupo por Encargado | `PublishersTable` en `ServiceGroupsPage` | `useServiceGroups` / `publishersService`| `public.profiles` | `PublishersTable.test.tsx`, `useServiceGroups.test.ts` |
| **REQ-004** | Recordatorios por WhatsApp | `WhatsAppReminderModal` en `DashboardPage` | `whatsappReminderService` | `public.service_groups` | `WhatsAppReminderModal.test.tsx`, `whatsappReminderService.test.ts` |
| **REQ-005** | Cierre Mensual con Checklist | `MonthClosingModal` en `DashboardPage` | Lógica en `DashboardPage` | Control de Período | `MonthClosingModal.test.tsx`, `DashboardPage.test.tsx` |
| **REQ-006** | Informe S-1 para la Sucursal | `BranchReportSummaryModal` en `ConsolidatedReportsPage` | `exportService` | `monthly_reports`, `attendance` | `BranchReportSummaryModal.test.tsx`, `ConsolidatedReportsPage.test.tsx` |
| **REQ-007** | Tarjeta Individual S-21 | `PublisherCardS21View` en `PublisherCardsPage` | `usePublisherManagement` / `publishersService`| `public.profiles`, `monthly_reports` | `PublisherCardS21View.test.tsx`, `PublisherCardsPage.test.tsx` |
| **REQ-008** | Importación Masiva de Nómina CSV | `PublisherImportModal` en `PublisherCardsPage` | `csvImportService` | `public.profiles` | `PublisherImportModal.test.tsx`, `csvImportService.test.ts` |
| **REQ-009** | Control de Asistencia Semanal | `AttendanceHistoryTable` en `MeetingAttendancePage` | `useMeetingAttendance` / `attendanceService` | `public.meeting_attendance` | `MeetingAttendancePage.test.tsx`, `attendanceService.test.ts` |
| **REQ-010** | Tablón de Comunicados Oficiales | `AnnouncementsBoard` en `DashboardPage` | `announcementsService` | `public.announcements` | `AnnouncementsBoard.test.tsx`, `announcementsService.test.ts` |

---

## 15.2 Matriz de Riesgos del Proyecto

| Riesgo Técnico / Operativo | Probabilidad | Impacto | Nivel de Riesgo | Estrategia de Mitigación Implementada |
|---|:---:|:---:|:---:|---|
| **Pérdida de conectividad celular en el Salón** | Alta | Alto | **ALTO** | Service Worker PWA con caché *stale-while-revalidate* y persistencia local de estado. |
| **Entrega de informes fuera de plazo (después del día 6)** | Alta | Medio | **MEDIO** | Notificaciones automáticas por WhatsApp a encargados con conteo dinámico de pendientes. |
| **Duplicación accidental de informes mensuales** | Media | Alto | **ALTO** | Constraint relacional de base de datos `UNIQUE(profile_id, month, year)`. |
| **Acceso no autorizado a datos de otros grupos** | Baja | Crítico | **CRÍTICO** | Políticas Row-Level Security (RLS) en PostgreSQL validadas con `auth.uid()`. |
| **Errores de formateo en el envío a la Sucursal** | Media | Alto | **ALTO** | Resumen S-1 compilado automáticamente con botón de copia limpia al portapapeles. |
| **Corrupción del índice de Git por observadores externos** | Baja | Medio | **BAJO** | Exclusión estricta de `.git` en `vite.config.ts` y configuración síncrona en `.git/config`. |
