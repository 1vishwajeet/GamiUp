-- Update admin_delete_contest function to NEVER touch participant data
-- Only move contest to history table, do NOT delete from main contests table
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
    'deleted', contest_image_url, contest_created_at,
    participant_count
  ) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    game = EXCLUDED.game,
    entry_fee = EXCLUDED.entry_fee,
    prize_pool = EXCLUDED.prize_pool,
    first_prize = EXCLUDED.first_prize,
    second_prize = EXCLUDED.second_prize,
    third_prize = EXCLUDED.third_prize,
    max_participants = EXCLUDED.max_participants,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    status = 'deleted',
    image_url = EXCLUDED.image_url,
    created_at = EXCLUDED.created_at,
    participant_count = EXCLUDED.participant_count,
    deleted_at = now();
  
  -- Instead of deleting, just mark contest as deleted by updating status
  UPDATE public.contests 
  SET status = 'deleted', updated_at = now()
  WHERE id = p_contest_id;
  
  IF participant_count > 0 THEN
    RETURN json_build_object(
      'success', true, 
      'message', 'Contest marked as deleted successfully. All ' || participant_count || ' participant records and payments have been preserved.'
    );
  ELSE
    RETURN json_build_object('success', true, 'message', 'Contest marked as deleted successfully');
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$;