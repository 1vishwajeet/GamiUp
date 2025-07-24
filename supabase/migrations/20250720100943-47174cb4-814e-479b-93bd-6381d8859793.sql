-- Create function to automatically clean up ended contests
CREATE OR REPLACE FUNCTION public.auto_cleanup_ended_contests()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  contest_record record;
  cleanup_count integer := 0;
BEGIN
  -- Find all ended contests that have participants
  FOR contest_record IN 
    SELECT c.*, COUNT(cp.id) as participant_count
    FROM public.contests c
    LEFT JOIN public.contest_participants cp ON c.id = cp.contest_id
    WHERE c.end_date <= now() AND c.status != 'ended'
    GROUP BY c.id
    HAVING COUNT(cp.id) > 0
  LOOP
    -- Move contest to history
    INSERT INTO public.contests_history (
      id, title, description, game, entry_fee, prize_pool,
      first_prize, second_prize, third_prize, max_participants,
      start_date, end_date, status, image_url, created_at,
      participant_count
    ) VALUES (
      contest_record.id, contest_record.title, contest_record.description,
      contest_record.game, contest_record.entry_fee, contest_record.prize_pool,
      contest_record.first_prize, contest_record.second_prize, contest_record.third_prize,
      contest_record.max_participants, contest_record.start_date, contest_record.end_date,
      'ended', contest_record.image_url, contest_record.created_at,
      contest_record.participant_count
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Delete the contest (keep participant data)
    DELETE FROM public.contests WHERE id = contest_record.id;
    
    cleanup_count := cleanup_count + 1;
  END LOOP;
  
  -- Also clean up contests without participants that have ended
  DELETE FROM public.contests 
  WHERE end_date <= now() 
    AND status != 'ended' 
    AND id NOT IN (SELECT DISTINCT contest_id FROM public.contest_participants);
  
  RETURN 'Cleaned up ' || cleanup_count || ' ended contests with participants. Participant data preserved.';
END;
$function$

-- Enable pg_cron extension (if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup function to run every hour
-- SELECT cron.schedule(
--   'auto-cleanup-ended-contests',
--   '0 * * * *', -- every hour at minute 0
--   'SELECT public.auto_cleanup_ended_contests();'
-- );