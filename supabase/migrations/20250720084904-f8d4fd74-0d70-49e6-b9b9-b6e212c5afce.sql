-- Create admin function to delete contests that bypasses RLS
CREATE OR REPLACE FUNCTION public.admin_delete_contest(contest_id uuid)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  BEGIN
    -- First delete all related contest participants
    DELETE FROM public.contest_participants WHERE contest_id = admin_delete_contest.contest_id;
    
    -- Then delete the contest
    DELETE FROM public.contests WHERE id = admin_delete_contest.contest_id;
    
    RETURN json_build_object('success', true, 'message', 'Contest deleted successfully');
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
  END;
$$;