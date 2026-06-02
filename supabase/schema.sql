-- Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    helpful_activities TEXT[] NOT NULL,
    other_activity TEXT,
    unclear_topic TEXT,
    more_practical_topic TEXT,
    final_project_feedback TEXT,
    keep_next_semester TEXT,
    improve_next_semester TEXT,
    additional_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT check_subject CHECK (subject IN (
        'Seminario de Finanzas',
        'Mercado de Valores',
        'Finanzas Internacionales'
    )),
    
    CONSTRAINT check_helpful_activities_not_empty CHECK (array_length(helpful_activities, 1) > 0),
    
    CONSTRAINT check_other_activity_length CHECK (other_activity IS NULL OR length(other_activity) <= 2000),
    CONSTRAINT check_unclear_topic_length CHECK (unclear_topic IS NULL OR length(unclear_topic) <= 2000),
    CONSTRAINT check_more_practical_topic_length CHECK (more_practical_topic IS NULL OR length(more_practical_topic) <= 2000),
    CONSTRAINT check_final_project_feedback_length CHECK (final_project_feedback IS NULL OR length(final_project_feedback) <= 2000),
    CONSTRAINT check_keep_next_semester_length CHECK (keep_next_semester IS NULL OR length(keep_next_semester) <= 2000),
    CONSTRAINT check_improve_next_semester_length CHECK (improve_next_semester IS NULL OR length(improve_next_semester) <= 2000),
    CONSTRAINT check_additional_comment_length CHECK (additional_comment IS NULL OR length(additional_comment) <= 2000),
    
    -- If 'Otra' is in helpful_activities, other_activity must be provided and not empty
    CONSTRAINT check_other_activity_provided CHECK (
        (NOT ('Otra' = ANY(helpful_activities))) OR (other_activity IS NOT NULL AND length(trim(other_activity)) > 0)
    )
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on both tables
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
END;
$$;

-- RLS Policies for survey_responses
-- 1. Anonymous/Public users can INSERT valid survey responses
CREATE POLICY "Allow public inserts" ON public.survey_responses
    FOR INSERT
    WITH CHECK (true);

-- 2. Only authenticated admins can SELECT survey responses
CREATE POLICY "Allow admin select" ON public.survey_responses
    FOR SELECT
    USING (public.is_admin());

-- 3. Nobody can UPDATE survey responses
CREATE POLICY "Disallow updates" ON public.survey_responses
    FOR UPDATE
    USING (false)
    WITH CHECK (false);

-- 4. Nobody can DELETE survey responses (or only admins if required, but prompt says: "Anonymous public users cannot delete... Only authorized administrators can access dashboard data and exports")
-- We can block deletes completely or restrict to admins. Let's restrict deletes to admins just in case, or disable completely.
CREATE POLICY "Allow admin delete" ON public.survey_responses
    FOR DELETE
    USING (public.is_admin());


-- RLS Policies for admin_users
-- Only authenticated admins can view list of admins
CREATE POLICY "Allow admin select admins" ON public.admin_users
    FOR SELECT
    USING (public.is_admin());
