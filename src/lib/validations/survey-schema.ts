import { z } from 'zod';

export const SUBJECT_OPTIONS = [
  'Seminario de Finanzas',
  'Mercado de Valores',
  'Finanzas Internacionales',
] as const;

export const HELPFUL_ACTIVITIES_OPTIONS = [
  'Explicaciones en clase',
  'Ejemplos o casos reales',
  'Noticias relacionadas con los temas',
  'Actividades prácticas',
  'Exposiciones',
  'Trabajo final',
  'Simulador de inversiones / portafolio, en caso de haberlo utilizado',
  'Materiales de apoyo',
  'Otra',
] as const;

export const surveySchema = z
  .object({
    subject: z.enum(SUBJECT_OPTIONS, {
      message: 'Selecciona la materia que cursaste.',
    }),
    helpful_activities: z
      .array(z.string())
      .min(1, 'Selecciona al menos una actividad.'),
    other_activity: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    unclear_topic: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    more_practical_topic: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    final_project_feedback: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    keep_next_semester: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    improve_next_semester: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    additional_comment: z
      .string()
      .max(2000, 'El texto no debe superar los 2000 caracteres.')
      .optional()
      .nullable(),
    // Honeypot field - must be empty
    honeypot: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.helpful_activities.includes('Otra')) {
        return !!data.other_activity && data.other_activity.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Escribe cuál fue la otra actividad que te ayudó.',
      path: ['other_activity'],
    }
  );

export type SurveyFormValues = z.infer<typeof surveySchema>;
