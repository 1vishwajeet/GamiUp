-- Create function to get participants for a specific custom challenge
CREATE OR REPLACE FUNCTION public.get_custom_challenge_participants(challenge_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  contest_id uuid,
  transaction_id text,
  payment_id text,
  payment_status text,
  joined_at timestamp with time zone,
  score integer,
  result_screenshot text,
  is_winner boolean,
  prize_amount numeric,
  game_id text,
  user_name text,
  user_contact text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT 
    cp.id,
    cp.user_id,
    cp.contest_id,
    cp.transaction_id,
    cp.payment_id,
    cp.payment_status,
    cp.joined_at,
    cp.score,
    cp.result_screenshot,
    cp.is_winner,
    cp.prize_amount,
    cp.game_id,
    p.name as user_name,
    p.whatsapp_number as user_contact
  FROM public.contest_participants cp
  LEFT JOIN public.profiles p ON p.user_id = cp.user_id
  WHERE cp.contest_id = challenge_id
  ORDER BY cp.joined_at DESC;
$function$;