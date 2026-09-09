import { z } from 'zod';

export const monthlyReportFormSchema = z
  .object({
    participated: z.boolean({
      required_error: 'Debe indicar si participó en el ministerio.',
    }),
    hours: z
      .number({
        required_error: 'Las horas son requeridas.',
        invalid_type_error: 'Debe ingresar un número entero válido.',
      })
      .int('Las horas deben ser un número entero.')
      .min(0, 'Las horas no pueden ser negativas.')
      .max(300, 'Las horas no pueden superar 300 en un solo mes.'),
    bible_studies: z
      .number({
        required_error: 'El número de cursos bíblicos es requerido.',
        invalid_type_error: 'Debe ingresar un número entero válido.',
      })
      .int('Los cursos bíblicos deben ser un número entero.')
      .min(0, 'El número de cursos bíblicos no puede ser negativo.')
      .max(50, 'El número de cursos bíblicos no puede superar 50.'),
    notes: z
      .string()
      .max(500, 'Las notas no pueden superar 500 caracteres.')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Si reporta horas > 0, la casilla de participación debe ser verdadera
      if (data.hours > 0 && !data.participated) {
        return false;
      }
      return true;
    },
    {
      message: 'Si ingresa horas de ministerio, debe marcar la casilla de participación.',
      path: ['participated'],
    }
  );

export type MonthlyReportFormData = z.infer<typeof monthlyReportFormSchema>;

