import type { PublisherRole, ServicePrivilege } from '@/types/database.types';

export interface ParsedPublisherRow {
  full_name: string;
  phone: string | null;
  role: PublisherRole;
  privilege: ServicePrivilege;
  groupNumber?: number;
}

export interface CsvImportResult {
  validRows: ParsedPublisherRow[];
  errors: { line: number; message: string }[];
  totalLines: number;
}

export const csvImportService = {
  /**
   * Genera el contenido de una plantilla CSV de ejemplo con BOM UTF-8.
   */
  generateTemplateCsv(): string {
    const headers = 'Nombre Completo,Telefono,Rol,Privilegio,Numero de Grupo';
    const sampleRows = [
      'Carlos Méndez,+52 55 1234 5678,anciano,precursor_regular,1',
      'Roberto Silva,+52 55 2345 6789,siervo_ministerial,publicador,1',
      'Ana María Gómez,+52 55 3456 7890,publicador,precursor_regular,1',
      'Daniel Castillo,+52 55 4567 8901,publicador,publicador,2',
    ];
    return '\uFEFF' + [headers, ...sampleRows].join('\r\n');
  },

  /**
   * Descarga la plantilla CSV en el navegador del usuario.
   */
  downloadTemplateCsv(filename = 'plantilla_publicadores_ejemplo.csv'): void {
    const csvContent = this.generateTemplateCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Analiza el texto de un archivo CSV y extrae los registros validados.
   */
  parseCsv(content: string): CsvImportResult {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const validRows: ParsedPublisherRow[] = [];
    const errors: { line: number; message: string }[] = [];

    if (lines.length <= 1) {
      return { validRows, errors: [{ line: 0, message: 'El archivo CSV está vacío o solo contiene encabezados.' }], totalLines: 0 };
    }

    // Detectar separador (, o ;)
    const firstLine = lines[0]!;
    const separator = firstLine.includes(';') ? ';' : ',';

    // Omitir fila de encabezados
    for (let i = 1; i < lines.length; i++) {
      const lineText = lines[i]!.trim();
      if (!lineText) continue;

      const cols = lineText.split(separator).map((c) => c.replace(/^["']|["']$/g, '').trim());

      const fullName = cols[0];
      const phone = cols[1] || null;
      const rawRole = (cols[2] || '').toLowerCase();
      const rawPrivilege = (cols[3] || '').toLowerCase();
      const rawGroup = cols[4];

      if (!fullName || fullName.length < 3) {
        errors.push({ line: i + 1, message: 'El nombre completo es obligatorio (mínimo 3 caracteres).' });
        continue;
      }

      // Normalizar rol
      let role: PublisherRole = 'publicador';
      if (rawRole.includes('secretario')) role = 'secretario';
      else if (rawRole.includes('anciano')) role = 'anciano';
      else if (rawRole.includes('ministerial') || rawRole.includes('siervo')) role = 'siervo_ministerial';

      // Normalizar privilegio
      let privilege: ServicePrivilege = 'publicador';
      if (rawPrivilege.includes('regular')) privilege = 'precursor_regular';
      else if (rawPrivilege.includes('auxiliar')) privilege = 'precursor_auxiliar';

      // Número de grupo
      let groupNumber: number | undefined = undefined;
      if (rawGroup) {
        const parsedG = parseInt(rawGroup, 10);
        if (!isNaN(parsedG) && parsedG > 0) {
          groupNumber = parsedG;
        }
      }

      validRows.push({
        full_name: fullName,
        phone: phone && phone.length > 5 ? phone : null,
        role,
        privilege,
        groupNumber,
      });
    }

    return {
      validRows,
      errors,
      totalLines: lines.length - 1,
    };
  },
};

