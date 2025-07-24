-- Update admin delete function to prevent deletion of contests with participants
DROP FUNCTION IF EXISTS public.admin_delete_contest(uuid);

CREATE OR REPLACE FUNCTION public.admin_delete_contest(p_contest_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  participant_count integer;
BEGIN
  -- Check if contest has any participants
  SELECT COUNT(*) INTO participant_count 
  FROM public.contest_participants 
  WHERE contest_id = p_contest_id;
  
  -- If contest has participants, prevent deletion
  IF participant_count > 0 THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Cannot delete contest with participants. Only editing is allowed.'
    );
  END IF;
  
  -- If no participants, proceed with deletion
  DELETE FROM public.contests WHERE id = p_contest_id;
  
  RETURN json_build_object('success', true, 'message', 'Contest deleted successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;