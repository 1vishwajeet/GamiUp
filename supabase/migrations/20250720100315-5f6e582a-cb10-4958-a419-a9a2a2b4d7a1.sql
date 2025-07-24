-- Update admin delete function to allow deletion even with participants
CREATE OR REPLACE FUNCTION public.admin_delete_contest(p_contest_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Delete all related data first (participants, payments, etc.)
  
  -- Delete contest participants
  DELETE FROM public.contest_participants 
  WHERE contest_id = p_contest_id;
  
  -- Delete related payments
  DELETE FROM public.payments 
  WHERE contest_id = p_contest_id;
  
  -- Delete the contest itself
  DELETE FROM public.contests WHERE id = p_contest_id;
  
  RETURN json_build_object('success', true, 'message', 'Contest and all related data deleted successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$