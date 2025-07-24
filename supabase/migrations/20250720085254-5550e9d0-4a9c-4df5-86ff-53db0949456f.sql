-- Fix the admin delete function to avoid column name ambiguity
DROP FUNCTION IF EXISTS public.admin_delete_contest(uuid);

CREATE OR REPLACE FUNCTION public.admin_delete_contest(p_contest_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First delete all related contest participants
  DELETE FROM public.contest_participants WHERE contest_id = p_contest_id;
  
  -- Then delete the contest
  DELETE FROM public.contests WHERE id = p_contest_id;
  
  RETURN json_build_object('success', true, 'message', 'Contest deleted successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;