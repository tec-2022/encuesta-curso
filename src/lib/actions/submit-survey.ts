'use server';

import { createClient } from '@/lib/supabase/server';
import { surveySchema, type SurveyFormValues } from '@/lib/validations/survey-schema';

export async function submitSurvey(values: SurveyFormValues) {
  // Validate data
  const result = surveySchema.safeParse(values);
  if (!result.success) {
    return {
      success: false,
      error: 'Datos inválidos. Por favor verifica tus respuestas.',
    };
  }

  const data = result.data;

  // Honeypot check
  if (data.honeypot && data.honeypot.trim() !== '') {
    // Silently reject by returning success without saving
    return { success: true };
  }

  // Save to database
  try {
    const supabase = await createClient();
    
    // Build query payload
    const { error } = await supabase.from('survey_responses').insert({
      subject: data.subject,
      helpful_activities: data.helpful_activities,
      other_activity: data.helpful_activities.includes('Otra') ? data.other_activity : null,
      unclear_topic: data.unclear_topic || null,
      more_practical_topic: data.more_practical_topic || null,
      final_project_feedback: data.final_project_feedback || null,
      keep_next_semester: data.keep_next_semester || null,
      improve_next_semester: data.improve_next_semester || null,
      additional_comment: data.additional_comment || null,
    });

    if (error) {
      console.error('Error inserting survey response:', error);
      return {
        success: false,
        error: 'No fue posible enviar tu respuesta. Inténtalo nuevamente.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Database connection error:', err);
    return {
      success: false,
      error: 'No fue posible conectar con el servidor. Inténtalo nuevamente.',
    };
  }
}
