import { createClient } from '@/lib/supabase/server';
import { SurveyResponse, SurveyFilters, DashboardStats, SubjectType } from '@/types/survey';

export async function getResponses(filters?: SurveyFilters): Promise<SurveyResponse[]> {
  const supabase = await createClient();
  let query = supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters) {
    if (filters.subject && filters.subject !== 'all' && filters.subject !== '') {
      query = query.eq('subject', filters.subject);
    }
    if (filters.startDate) {
      // Start of the day (00:00:00)
      query = query.gte('created_at', `${filters.startDate}T00:00:00Z`);
    }
    if (filters.endDate) {
      // End of the day (23:59:59)
      query = query.lte('created_at', `${filters.endDate}T23:59:59Z`);
    }
    if (filters.search && filters.search.trim() !== '') {
      const keyword = `%${filters.search.trim()}%`;
      query = query.or(
        `unclear_topic.ilike.${keyword},` +
        `more_practical_topic.ilike.${keyword},` +
        `final_project_feedback.ilike.${keyword},` +
        `keep_next_semester.ilike.${keyword},` +
        `improve_next_semester.ilike.${keyword},` +
        `additional_comment.ilike.${keyword}`
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching survey responses:', error);
    return [];
  }

  return (data || []) as SurveyResponse[];
}

export async function getResponseById(id: string): Promise<SurveyResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching survey response ${id}:`, error);
    return null;
  }

  return data as SurveyResponse | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const responses = await getResponses();

  const totalResponses = responses.length;
  
  const subjectCounts: Record<SubjectType, number> = {
    'Seminario de Finanzas': 0,
    'Mercado de Valores': 0,
    'Finanzas Internacionales': 0,
  };

  const activityCounts: Record<string, number> = {};

  let latestResponseDate: string | null = null;

  responses.forEach((res) => {
    // Count subjects
    if (res.subject in subjectCounts) {
      subjectCounts[res.subject]++;
    }

    // Count helpful activities
    res.helpful_activities.forEach((activity) => {
      let actName = activity;
      if (activity === 'Otra' && res.other_activity) {
        actName = `Otra: ${res.other_activity}`;
      }
      activityCounts[actName] = (activityCounts[actName] || 0) + 1;
    });

    // Check latest response
    if (!latestResponseDate || new Date(res.created_at) > new Date(latestResponseDate)) {
      latestResponseDate = res.created_at;
    }
  });

  return {
    totalResponses,
    subjectCounts,
    activityCounts,
    latestResponseDate,
  };
}
