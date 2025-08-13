-- Create admin function to delete winner submissions
CREATE OR REPLACE FUNCTION public.admin_delete_winner_submission(submission_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Delete the winner submission record directly
  DELETE FROM public.winner_submissions 
  WHERE id = submission_id;
  
  IF FOUND THEN
    RETURN json_build_object('success', true, 'message', 'Winner submission deleted successfully');
  ELSE
    RETURN json_build_object('success', false, 'message', 'Winner submission not found');
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;