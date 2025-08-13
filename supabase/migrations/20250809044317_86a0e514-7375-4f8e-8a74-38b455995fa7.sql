-- Create function to get custom challenges with creator info
CREATE OR REPLACE FUNCTION public.get_admin_custom_challenges()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  game text,
  entry_fee numeric,
  first_prize numeric,
  second_prize numeric,
  third_prize numeric,
  max_participants integer,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text,
  created_at timestamp with time zone,
  created_by uuid,
  creator_name text,
  creator_contact text,
  participant_count bigint,
  payment_status text
)
LANGUAGE sql
SECURITY DEFINER
AS $function$
  SELECT 
    c.id,
    c.title,
    c.description,
    c.game,
    c.entry_fee,
    c.first_prize,
    c.second_prize,
    c.third_prize,
    c.max_participants,
    c.start_date,
    c.end_date,
    c.status,
    c.created_at,
    c.created_by,
    p.name as creator_name,
    p.whatsapp_number as creator_contact,
    (SELECT COUNT(*) FROM public.contest_participants cp WHERE cp.contest_id = c.id) as participant_count,
    COALESCE(ccp.status, 'pending') as payment_status
  FROM public.contests c
  LEFT JOIN public.profiles p ON p.user_id = c.created_by
  LEFT JOIN public.custom_contest_payments ccp ON ccp.contest_id = c.id
  WHERE c.created_by IS NOT NULL
  ORDER BY c.created_at DESC;
$function$

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
$function$