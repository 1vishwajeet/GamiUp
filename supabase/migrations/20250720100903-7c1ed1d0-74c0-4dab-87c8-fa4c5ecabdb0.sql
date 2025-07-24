-- Update admin delete function to check end date and preserve data
CREATE OR REPLACE FUNCTION public.admin_delete_contest(p_contest_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  participant_count integer;
  contest_end_date timestamp with time zone;
  contest_title text;
  contest_description text;
  contest_game text;
  contest_entry_fee numeric;
  contest_prize_pool numeric;
  contest_first_prize numeric;
  contest_second_prize numeric;
  contest_third_prize numeric;
  contest_max_participants integer;
  contest_start_date timestamp with time zone;
  contest_status text;
  contest_image_url text;
  contest_created_at timestamp with time zone;
BEGIN
  -- Get contest info
  SELECT 
    end_date, title, description, game, entry_fee, prize_pool,
    first_prize, second_prize, third_prize, max_participants,
    start_date, status, image_url, created_at
  INTO 
    contest_end_date, contest_title, contest_description, contest_game,
    contest_entry_fee, contest_prize_pool, contest_first_prize,
    contest_second_prize, contest_third_prize, contest_max_participants,
    contest_start_date, contest_status, contest_image_url, contest_created_at
  FROM public.contests 
  WHERE id = p_contest_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Contest not found');
  END IF;
  
  -- Check if contest has participants
  SELECT COUNT(*) INTO participant_count 
  FROM public.contest_participants 
  WHERE contest_id = p_contest_id;
  
  -- If contest has participants and hasn't ended yet, prevent deletion
  IF participant_count > 0 AND contest_end_date > now() THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Cannot delete contest with participants before end date. Contest will auto-delete after ' || to_char(contest_end_date, 'YYYY-MM-DD HH24:MI')
    );
  END IF;
  
  -- If contest has participants and has ended, move to history
  IF participant_count > 0 THEN
    -- Move contest to history table
    INSERT INTO public.contests_history (
      id, title, description, game, entry_fee, prize_pool,
      first_prize, second_prize, third_prize, max_participants,
      start_date, end_date, status, image_url, created_at,
      participant_count
    ) VALUES (
      p_contest_id, contest_title, contest_description,
      contest_game, contest_entry_fee, contest_prize_pool,
      contest_first_prize, contest_second_prize, contest_third_prize,
      contest_max_participants, contest_start_date, contest_end_date,
      'ended', contest_image_url, contest_created_at,
      participant_count
    );
    
    -- Delete only the contest (keep participants data)
    DELETE FROM public.contests WHERE id = p_contest_id;
    
    RETURN json_build_object(
      'success', true, 
      'message', 'Contest moved to history. Participant data preserved.'
    );
  ELSE
    -- No participants, safe to delete everything
    DELETE FROM public.contests WHERE id = p_contest_id;
    
    RETURN json_build_object('success', true, 'message', 'Contest deleted successfully');
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$