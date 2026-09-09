# 10. Catálogo de Servicios y Comunicación

Toda la interacción con fuentes de datos externas, el motor de Supabase y la generación de archivos se encuentra encapsulada dentro del directorio `src/services/`.

## 10.1 `publishersService.ts`
Encargado de la administración de publicadores, cálculo de métricas anuales y gestión de la tarjeta S-21.
- **`getPublishers(filters?: PublisherFilters): Promise<ServiceResult<Profile[]>>`**:
  - Filtra por grupo, rol teocrático, nombramiento o búsqueda de texto por nombre/teléfono.
  - Ordena alfabéticamente por nombre completo.
- **`getPublisherById(id: string): Promise<ServiceResult<Profile>>`**:
  - Obtiene el perfil completo de un publicador mediante consulta indexada por clave primaria.
- **`createPublisher(profile: ProfileInsert): Promise<ServiceResult<Profile>>`**:
  - Da de alta un nuevo publicador en la congregación.
- **`updatePublisher(id: string, updates: ProfileUpdate): Promise<ServiceResult<Profile>>`**:
  - Modifica datos de contacto, grupo de predicación o nombramiento.
- **`getPublisherS21Card(publisherId: string, year: number): Promise<ServiceResult<PublisherS21Card>>`**:
  - Compila los 12 meses del año teocrático calculando horas acumuladas, promedios mensuales y meses activos.

## 10.2 `reportsService.ts`
Maneja la entrega, consulta y auditoría de informes mensuales de predicación.
- **`getReportByPublisher(profileId: string, month: number, year: number): Promise<ServiceResult<MonthlyReport>>`**:
  - Consulta si el publicador ya ha generado un informe en el período indicado.
- **`submitReport(report: MonthlyReportInsert): Promise<ServiceResult<MonthlyReport>>`**:
  - Registra o actualiza el informe estableciendo el estado en `'submitted'`.
- **`confirmReport(reportId: string, confirmedBy: string): Promise<ServiceResult<MonthlyReport>>`**:
  - Valida el informe estableciendo `status = 'confirmed'` y registrando el timestamp `confirmed_at`.

## 10.3 `groupsService.ts`
Administra los grupos de servicio del campo de la congregación.
- **`getGroups(): Promise<ServiceResult<ServiceGroup[]>>`**:
  - Retorna todos los grupos de la congregación ordenados por `group_number`.
- **`createGroup(group: ServiceGroupInsert): Promise<ServiceResult<ServiceGroup>>`**:
  - Registra un nuevo grupo garantizando que el número sea único.
- **`updateGroup(id: string, updates: ServiceGroupUpdate): Promise<ServiceResult<ServiceGroup>>`**:
  - Actualiza el nombre, lugar de salida, horario o superintendente asignado.
- **`deleteGroup(id: string, fallbackGroupId: string): Promise<ServiceResult<boolean>>`**:
  - Reasigna a los publicadores al `fallbackGroupId` antes de ejecutar la eliminación segura del grupo.

## 10.4 `attendanceService.ts`
Control de asistencia semanal a reuniones teocráticas.
- **`getMonthlyAttendance(month: number, year: number): Promise<ServiceResult<MeetingAttendanceRecord[]>>`**:
  - Retorna todas las sesiones de reunión celebradas en el mes calendario.
- **`recordAttendance(attendance: MeetingAttendanceInsert): Promise<ServiceResult<MeetingAttendanceRecord>>`**:
  - Guarda el conteo de asistentes indicando si fue reunión Entre Semana o Fin de Semana.
- **`calculateMonthlyAverages(month: number, year: number)`**:
  - Computa los promedios requeridos para el informe S-1 a la Sucursal.

## 10.5 `announcementsService.ts`
Tablón de anuncios congregacionales oficiales.
- **`getAnnouncements(): Announcement[]`**:
  - Retorna los avisos ordenados con prioridad `alta` primero y luego por fecha reciente.
- **`addAnnouncement(data: Omit<Announcement, 'id' | 'created_at'>): Announcement`**:
  - Publica un nuevo comunicado oficial con fecha, lugar y autor.
- **`deleteAnnouncement(id: string): void`**:
  - Elimina un anuncio obsoleto del tablón.

## 10.6 `csvImportService.ts`
Parser de importación masiva para secretaría.
- **`parseCsv(rawText: string): CsvParseResult`**:
  - Detecta automáticamente el delimitador (`,` o `;`), procesa encabezados teocráticos y normaliza nombramientos.
- **`downloadTemplateCsv(): void`**:
  - Genera y descarga en el navegador una plantilla de ejemplo en formato CSV con columnas oficiales.

## 10.7 `whatsappReminderService.ts`
Generador de enlaces para envío de recordatorios mediante protocolo universal URI `wa.me`.
- **`buildReminderMessage(data: GroupReminderData, monthName: string, deadlineDay: number): string`**:
  - Redacta un mensaje teocrático cordial y adaptativo según la cantidad de pendientes.
- **`generateWhatsAppUrl(phone: string, message: string): string`**:
  - Sanitiza el número de teléfono, elimina espacios y caracteres no numéricos, y codifica el texto con `encodeURIComponent`.
