import type { PublisherS21Card } from '@/types/database.types';

/**
 * Descarga una cadena de texto como archivo en el navegador
 */
function downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapa comillas y comas para campos CSV
 */
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const exportService = {
  /**
   * Exporta la tarjeta de registro S-21 de un publicador en formato CSV con BOM UTF-8 para Excel
   */
  exportPublisherS21Csv(card: PublisherS21Card): void {
    const bom = '\uFEFF'; // UTF-8 Byte Order Mark para compatibilidad nativa con Microsoft Excel
    const lines: string[] = [];

    // Metadatos teocráticos del publicador
    lines.push('REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN (S-21)');
    lines.push(`Nombre de Publicador,${escapeCsv(card.publisher.full_name)}`);
    lines.push(`Año de Servicio,${escapeCsv(card.serviceYear)}`);
    lines.push(`Grupo de Servicio,${escapeCsv(card.serviceGroup?.name || 'Sin asignar')}`);
    lines.push(`Nombramiento,${escapeCsv(card.publisher.role)}`);
    lines.push(`Privilegio de Servicio,${escapeCsv(card.publisher.privilege)}`);
    lines.push(`Estado,${card.publisher.is_active ? 'Activo' : 'Inactivo'}`);
    lines.push(''); // Línea en blanco

    // Resumen Teocrático Anual
    const isPioneer =
      card.publisher.privilege === 'precursor_auxiliar' ||
      card.publisher.privilege === 'precursor_regular';

    lines.push('RESUMEN ANUAL');
    if (isPioneer) {
      lines.push(`Total de Horas,${card.totalHours}`);
      lines.push(`Promedio Mensual de Horas,${card.averageHours}`);
      lines.push(`Meta Anual de Horas,${card.annualGoal}`);
      lines.push(`Cumplimiento de Meta,${card.goalProgressPct}%`);
    } else {
      const activeMonths = card.records.filter((r) => r.participated).length;
      lines.push(`Meses con Participación,${activeMonths} de 12 meses`);
      lines.push(`Porcentaje de Regularidad,${Math.round((activeMonths / 12) * 100)}%`);
      lines.push('Requisito de Horas,Sin cuota de horas (Publicador de congregación)');
    }
    lines.push(`Total Cursos Bíblicos Diferentes,${card.totalStudies}`);
    lines.push('');

    // Tabla canónica de los 12 meses teocráticos
    lines.push('DESGLOSE MENSUAL');
    lines.push('Mes,Año,Participó en el Ministerio,Horas Reportadas,Cursos Bíblicos,Estado,Notas');

    card.records.forEach((record) => {
      const participoTexto = record.participated ? 'Sí' : 'No';
      const horasTexto = isPioneer ? record.hours : record.participated ? 'Participó' : '–';
      lines.push(
        [
          escapeCsv(record.monthName),
          record.year,
          participoTexto,
          horasTexto,
          record.bible_studies,
          escapeCsv(record.status),
          escapeCsv(record.notes || ''),
        ].join(',')
      );
    });

    const csvContent = bom + lines.join('\r\n');
    const safeName = card.publisher.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadFile(csvContent, `tarjeta_s21_${safeName}_${card.serviceYear.replace(/\s+/g, '_')}.csv`);
  },

  /**
   * Exporta el resumen consolidado de congregación en CSV
   */
  exportConsolidatedReportsCsv(
    period: string,
    groups: Array<{
      id: string;
      name: string;
      groupNumber: number;
      totalPublishers: number;
      submittedReports: number;
      hoursTotal: number;
      bibleStudiesTotal: number;
    }>
  ): void {
    const bom = '\uFEFF';
    const lines: string[] = [];

    lines.push('INFORME CONSOLIDADO DE LA CONGREGACIÓN');
    lines.push(`Período Teocrático,${escapeCsv(period)}`);
    lines.push(`Fecha de Exportación,${new Date().toLocaleDateString('es-MX')}`);
    lines.push('');

    lines.push('Grupo,Número,Total Publicadores,Informes Entregados,% Cumplimiento,Total Horas,Cursos Bíblicos');

    groups.forEach((grp) => {
      const pct = grp.totalPublishers > 0
        ? Math.round((grp.submittedReports / grp.totalPublishers) * 100)
        : 0;
      lines.push(
        [
          escapeCsv(grp.name),
          grp.groupNumber,
          grp.totalPublishers,
          grp.submittedReports,
          `${pct}%`,
          grp.hoursTotal,
          grp.bibleStudiesTotal,
        ].join(',')
      );
    });

    const csvContent = bom + lines.join('\r\n');
    downloadFile(csvContent, `informe_consolidado_${period.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  },

  /**
   * Activa el diálogo nativo de impresión para la vista actual
   */
  triggerPrint(): void {
    window.print();
  },
};
