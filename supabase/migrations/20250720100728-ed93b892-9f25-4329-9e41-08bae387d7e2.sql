-- First, create a historical contests table to preserve contest info
CREATE TABLE IF NOT EXISTS public.contests_history (
  id uuid NOT NULL,
  title text NOT NULL,
  description text,
  game text NOT NULL,
  entry_fee numeric NOT NULL,
  prize_pool numeric NOT NULL,
  first_prize numeric DEFAULT 0.00,
  second_prize numeric DEFAULT 0.00,
  third_prize numeric DEFAULT 0.00,
  max_participants integer NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status text DEFAULT 'ended',
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone DEFAULT now(),
  participant_count integer DEFAULT 0,
  PRIMARY KEY (id)
);

-- Enable RLS on contests_history
ALTER TABLE public.contests_history ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view contest history
CREATE POLICY "Admins can view contest history" 
ON public.contests_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Update admin delete function to check end date and preserve data
CREATE OR REPLACE FUNCTION public.admin_delete_contest(p_contest_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  participant_count integer;
  contest_end_date timestamp with time zone;
  contest_record record;
BEGIN
  -- Get contest info
  SELECT end_date, * INTO contest_end_date, contest_record 
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
      'message', 'Cannot delete contest with participants before end date. Contest will auto-delete after ' || contest_end_date::text
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
      contest_record.id, contest_record.title, contest_record.description,
      contest_record.game, contest_record.entry_fee, contest_record.prize_pool,
      contest_record.first_prize, contest_record.second_prize, contest_record.third_prize,
      contest_record.max_participants, contest_record.start_date, contest_record.end_date,
      'ended', contest_record.image_url, contest_record.created_at,
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