import { describe, it, expect } from 'vitest';
import { monthlyReportFormSchema } from './monthlyReportSchema';

describe('monthlyReportFormSchema validation', () => {
  it('valida exitosamente un informe típico válido', () => {
    const validData = {
      participated: true,
      hours: 45,
      bible_studies: 4,
      notes: 'Mes con buena actividad en el territorio rural.',
    };

    const result = monthlyReportFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('valida exitosamente un publicador que solo participó con 0 horas (ej. de edad avanzada o enfermo con 15 min reportados como participación)', () => {
    const validData = {
      participated: true,
      hours: 0,
      bible_studies: 0,
      notes: '',
    };

    const result = monthlyReportFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('falla si las horas son negativas', () => {
    const invalidData = {
      participated: true,
      hours: -5,
      bible_studies: 2,
    };

    const result = monthlyReportFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Las horas no pueden ser negativas.');
    }
  });

  it('falla si los cursos bíblicos son negativos', () => {
    const invalidData = {
      participated: true,
      hours: 20,
      bible_studies: -1,
    };

    const result = monthlyReportFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('El número de cursos bíblicos no puede ser negativo.');
    }
  });

  it('falla si las horas superan el límite de 300', () => {
    const invalidData = {
      participated: true,
      hours: 350,
      bible_studies: 5,
    };

    const result = monthlyReportFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Las horas no pueden superar 300 en un solo mes.');
    }
  });

  it('falla si reporta horas > 0 pero participated es false', () => {
    const invalidData = {
      participated: false,
      hours: 15,
      bible_studies: 0,
    };

    const result = monthlyReportFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Si ingresa horas de ministerio, debe marcar la casilla de participación.'
      );
    }
  });
});
