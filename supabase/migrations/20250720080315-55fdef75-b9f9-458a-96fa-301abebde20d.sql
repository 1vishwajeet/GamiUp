-- Create a function to get contest participants data for admin panel
-- This function will bypass RLS policies for admin access

CREATE OR REPLACE FUNCTION public.get_admin_contest_participants()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  contest_id uuid,
  transaction_id text,
  payment_id text,
  payment_status text,
  joined_at timestamptz,
  score integer,
  result_screenshot text,
  is_winner boolean,
  prize_amount numeric,
  game_id text
)
LANGUAGE sql
SECURITY DEFINER  -- This allows the function to bypass RLS
AS $$
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
    cp.game_id
  FROM public.contest_participants cp
  ORDER BY cp.joined_at DESC;
$$;

-- Create function to get profiles for admin
CREATE OR REPLACE FUNCTION public.get_admin_profiles(user_ids uuid[])
RETURNS TABLE (
  user_id uuid,
  name text,
  whatsapp_number text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.user_id,
    p.name,
    p.whatsapp_number
  FROM public.profiles p
  WHERE p.user_id = ANY(user_ids);
$$;

-- Create function to get contests for admin
CREATE OR REPLACE FUNCTION public.get_admin_contests(contest_ids uuid[])
RETURNS TABLE (
  id uuid,
  title text,
  game text,
  entry_fee numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.title,
    c.game,
    c.entry_fee
  FROM public.contests c
  WHERE c.id = ANY(contest_ids);
$$;