import { describe, it, expect } from 'vitest';
import { csvImportService } from './csvImportService';

describe('csvImportService', () => {
  it('genera la plantilla de ejemplo con encabezados correctos', () => {
    const template = csvImportService.generateTemplateCsv();
    expect(template).toContain('Nombre Completo');
    expect(template).toContain('Carlos Méndez');
  });

  it('analiza correctamente un CSV con comas y normaliza roles y privilegios', () => {
    const csvContent = 
      'Nombre Completo,Telefono,Rol,Privilegio,Numero de Grupo\n' +
      'Esteban Morales,+52 55 1111 2222,anciano,precursor_regular,1\n' +
      'Marta Sánchez,,publicador,precursor_auxiliar,2\n';

    const result = csvImportService.parseCsv(csvContent);

    expect(result.errors).toHaveLength(0);
    expect(result.validRows).toHaveLength(2);
    expect(result.validRows[0]?.full_name).toBe('Esteban Morales');
    expect(result.validRows[0]?.role).toBe('anciano');
    expect(result.validRows[0]?.privilege).toBe('precursor_regular');
    expect(result.validRows[0]?.groupNumber).toBe(1);

    expect(result.validRows[1]?.full_name).toBe('Marta Sánchez');
    expect(result.validRows[1]?.phone).toBeNull();
    expect(result.validRows[1]?.privilege).toBe('precursor_auxiliar');
  });

  it('reporta error si una fila no tiene nombre completo válido', () => {
    const csvContent = 
      'Nombre Completo,Telefono,Rol,Privilegio,Numero de Grupo\n' +
      ',+52 55 1111 2222,publicador,publicador,1\n';

    const result = csvImportService.parseCsv(csvContent);

    expect(result.validRows).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.line).toBe(2);
  });
});

