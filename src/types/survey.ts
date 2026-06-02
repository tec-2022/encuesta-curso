export type SubjectType = 'Seminario de Finanzas' | 'Mercado de Valores' | 'Finanzas Internacionales';

export interface SurveyResponse {
  id: string;
  subject: SubjectType;
  helpful_activities: string[];
  other_activity: string | null;
  unclear_topic: string | null;
  more_practical_topic: string | null;
  final_project_feedback: string | null;
  keep_next_semester: string | null;
  improve_next_semester: string | null;
  additional_comment: string | null;
  created_at: string;
}

export interface SurveyFilters {
  subject?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface DashboardStats {
  totalResponses: number;
  subjectCounts: Record<SubjectType, number>;
  activityCounts: Record<string, number>;
  latestResponseDate: string | null;
}
