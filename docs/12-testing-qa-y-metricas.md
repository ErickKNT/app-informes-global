# 12. Estrategia de Pruebas, Aseguramiento de Calidad (QA) y Métricas

## 12.1 Resumen del Estado de la Suite de Pruebas
Al día de hoy, la suite de pruebas automatizada se ejecuta íntegramente mediante **Vitest 3.0.5** y **Testing Library**, registrando un **100% de éxito**:

- **Total de Suites de Prueba:** `58 suites`
- **Total de Pruebas Unitarias e Integración:** `182 pruebas`
- **Pruebas Fallidas:** `0`
- **Tiempo Promedio de Ejecución:** `~20 segundos`
- **TypeScript:** `0 errores` con `npx tsc --noEmit`.

---

## 12.2 Inventario Completo de Suites de Prueba

### Pruebas de Átomos (`src/components/atoms/`)
1. `Avatar.test.tsx` (3 tests): Renderizado de iniciales, imagen y tamaños adaptativos.
2. `Badge.test.tsx` (4 tests): Renderizado de variantes teocráticas (`precursor_regular`, `anciano`, etc.).
3. `Button.test.tsx` (4 tests): Interacción de clic, estados de carga y variantes visuales.
4. `Checkbox.test.tsx` (3 tests): Estado checked/unchecked y accesibilidad con etiqueta.
5. `Input.test.tsx` (5 tests): Tipos texto/número, íconos y renderizado de errores.
6. `Select.test.tsx` (5 tests): Opciones desplegables, selección y disparo de evento onChange.

### Pruebas de Moléculas (`src/components/molecules/`)
7. `AlertBanner.test.tsx` (2 tests): Renderizado de días restantes y callback de notificación a encargados.
8. `FormField.test.tsx` (3 tests): Vinculación de etiqueta accesible y mensaje de validación.
9. `RoleSelectorPill.test.tsx` (3 tests): Alternancia entre roles de servicio.
10. `SearchBar.test.tsx` (3 tests): Búsqueda de texto y botón de limpieza.
11. `Sparkline.test.tsx` (3 tests): Generación de puntos SVG en gráfica compacta.

### Pruebas de Organismos (`src/components/organisms/`)
12. `AnnouncementsBoard.test.tsx` (3 tests): Renderizado de avisos, creación modal y eliminación autorizada.
13. `BranchReportSummaryModal.test.tsx` (3 tests): Renderizado S-1, copia al portapapeles en 1 clic e impresión.
14. `MonthClosingModal.test.tsx` (2 tests): Bloqueo de confirmación hasta marcar los 3 puntos del checklist.
15. `PublisherImportModal.test.tsx` (5 tests): Carga de CSV, descarga de plantilla y previsualización.
16. `WhatsAppReminderModal.test.tsx` (4 tests): Lista de encargados, pendientes y modo de prueba interactivo.
17. `PublisherCardS21View.test.tsx` (3 tests): Cuadrícula de 12 meses y botones de administración S-21.
18. `PublisherFormModal.test.tsx` (3 tests): Validación de campos y registro/edición de publicador.
19. `PublisherTransferModal.test.tsx` (1 test): Reasignación de publicador hacia otro grupo de servicio.
20. `PublishersTable.test.tsx` (5 tests): Filtrado por estado de entrega, rol y búsqueda por nombre.
21. `AssistedReportModal.test.tsx` (4 tests): Llenado asistido con selección de nombramiento y horas.
22. `DeleteGroupModal.test.tsx` (1 test): Exigencia de seleccionar grupo de respaldo para publicadores.
23. `GroupFormModal.test.tsx` (2 tests): Creación y actualización de grupos de predicación.
24. `GroupMetricsCards.test.tsx` (1 test): Indicadores de publicadores, horas y estudios del grupo.
25. `GroupSupervisorsCard.test.tsx` (1 test): Información de contacto del superintendente y auxiliar.
26. `GroupsOverviewTable.test.tsx` (3 tests): Desglose por grupo y callback de selección.
27. `HistoricalComparativeChart.test.tsx` (2 tests): Gráfica de barras SVG y comparativa por año.
28. `HoursGaugeCard.test.tsx` (3 tests): Medidor circular de porcentaje de horas.
29. `PastoralAlertsCard.test.tsx` (2 tests): Identificación de publicadores con necesidad de apoyo.
30. `RegularPioneersGoalCard.test.tsx` (3 tests): Meta de 600 horas y proyección de cumplimiento.
31. `ReportSubmissionForm.test.tsx` (4 tests): Formulario de informe personal con lógica según privilegio.
32. `S21ConsolidatedTable.test.tsx` (2 tests): Formato S-21-S canónico con columnas oficiales.
33. `CongregationKPIs.test.tsx` (1 test): Tarjetas maestras de métricas congregacionales.
34. `ConsolidatedMetricsSummary.test.tsx` (2 tests): Resumen anual acumulado de horas y estudios.

### Pruebas de Plantillas y Páginas (`src/pages/` y `src/components/templates/`)
35. `AppLayout.test.tsx` (3 tests): Navegación lateral en desktop y menú hamburguesa móvil.
36. `LoginPage.test.tsx` (3 tests): Acceso con credenciales y botones de acceso de prueba rápida.
37. `DashboardPage.test.tsx` (4 tests): Panel general, KPIs, recordatorios WhatsApp, cierre de mes y tablón de anuncios.
38. `MonthlyReportPage.test.tsx` (4 tests): Envío de informe personal con validación y estados.
39. `ServiceGroupsPage.test.tsx` (5 tests): Vista de grupos, pestañas, registro asistido y nuevo grupo.
40. `PublisherCardsPage.test.tsx` (4 tests): Expedientes S-21, búsqueda, alta de publicador e importador CSV.
41. `MeetingAttendancePage.test.tsx` (2 tests): Asistencia semanal, promedios mensuales y nuevo registro.
42. `ConsolidatedReportsPage.test.tsx` (4 tests): Tabla consolidada S-21-S y modal de informe para Sucursal S-1.
43. `App.test.tsx` (5 tests): Enrutamiento global de la SPA y control de acceso según los 3 niveles de roles.

### Pruebas de Servicios, Hooks y Esquemas
44. `publishersService.test.ts` (3 tests): Consultas, filtros y cálculo S-21.
45. `reportsService.test.ts` (2 tests): Creación y confirmación de informes.
46. `groupsService.test.ts` (4 tests): Operaciones CRUD sobre grupos de servicio.
47. `attendanceService.test.ts` (2 tests): Registro de asistencia y promedios.
48. `announcementsService.test.ts` (3 tests): Priorización y operaciones del tablón.
49. `csvImportService.test.ts` (3 tests): Parser de CSV, detección de delimitadores y plantilla.
50. `whatsappReminderService.test.ts` (4 tests): Generación de mensajes y sanitización de teléfonos.
51. `exportService.test.ts` (3 tests): Exportaciones PDF y Excel.
52. `AuthContext.test.tsx` (3 tests): Autenticación, persistencia y cierre de sesión.
53. `useMonthlyReport.test.ts` (2 tests): Lógica de informe personal.
54. `useServiceGroups.test.ts` (4 tests): Lógica de grupos y reportes asistidos.
55. `usePublisherManagement.test.ts` (5 tests): Filtros y operaciones S-21.
56. `useMeetingAttendance.test.ts` (2 tests): Recálculo de promedios de asistencia.
57. `monthlyReportSchema.test.ts` (7 tests): Validaciones Zod de horas, estudios y roles.
58. `cn.test.ts` (3 tests): Fusión de clases CSS de Tailwind.

---

## 12.3 Checklist Formal de Control de Calidad (QA)
Antes de certificar una nueva versión para despliegue congregacional, el QA Lead debe verificar y firmar el siguiente procedimiento:

- [ ] **1. Verificación Estática:** Ejecución de `npx tsc --noEmit` concluye con código de salida `0` (cero errores).
- [ ] **2. Suite Automatizada:** Ejecución de `npm test -- --run` finaliza con el 100% de las pruebas aprobadas (`182/182 passed`).
- [ ] **3. Compilación de Producción:** Ejecución de `npm run build` genera exitosamente los artefactos en `dist/` sin errores de importación.
- [ ] **4. Control de Acceso (Nivel 1):** Iniciar sesión como Publicador (*Mateo González*) y verificar que únicamente tenga acceso visible y navegable a *"Mi Informe Mensual"*.
- [ ] **5. Control de Acceso (Nivel 2):** Iniciar sesión como Encargado de Grupo (*Carlos Méndez*) y verificar que solo vea su grupo asignado (*Grupo 1*) y no pueda eliminar grupos ni ver tarjetas de otros grupos.
- [ ] **6. Control de Acceso (Nivel 3):** Iniciar sesión como Secretario (*David Morales*) y confirmar visibilidad total sobre los 6 módulos.
- [ ] **7. Flujo de WhatsApp:** Abrir modal de recordatorios en Dashboard, ingresar número de prueba y verificar apertura correcta del enlace universal `wa.me`.
- [ ] **8. Cierre de Mes:** Abrir modal de Cierre de Mes, comprobar que el botón de confirmación permanece inactivo hasta marcar los 3 checkboxes y verificar que al confirmar avanza el mes activo.
- [ ] **9. Resumen para Sucursal (S-1):** En Reportes Consolidados, pulsar *"Informe para Sucursal"*, verificar cifras y probar el botón de copia al portapapeles.
- [ ] **10. Importador CSV:** En Tarjetas de Publicador, pulsar *"Importar CSV"*, descargar plantilla de prueba, cargar archivo y verificar la tabla de previsualización.
- [ ] **11. Tablón de Anuncios:** Publicar un aviso importante y verificar que se coloque en primer lugar con distintivo ámbar.
- [ ] **12. Inspección PWA:** Validar presencia de `manifest.webmanifest`, registrar Service Worker en pestaña Application de Chrome DevTools y probar recarga sin conexión.
- [ ] **13. Iconografía:** Confirmar que no exista ninguna cruz ni símbolo inapropiado en ninguna vista.
- [ ] **14. Diseño Responsivo:** Probar navegación en viewport móvil (375px), tablet (768px) y escritorio (1440px).
