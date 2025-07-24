-- Create admin function to get winner submissions
-- This will bypass RLS for winner submissions data

CREATE OR REPLACE FUNCTION public.get_admin_winner_submissions()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  contest_id uuid,
  score integer,
  result_screenshot text,
  is_winner boolean,
  prize_amount numeric,
  joined_at timestamptz,
  user_name text,
  contest_title text,
  first_prize numeric,
  second_prize numeric,
  third_prize numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    cp.id,
    cp.user_id,
    cp.contest_id,
    cp.score,
    cp.result_screenshot,
    cp.is_winner,
    cp.prize_amount,
    cp.joined_at,
    p.name as user_name,
    c.title as contest_title,
    c.first_prize,
    c.second_prize,
    c.third_prize
  FROM public.contest_participants cp
  LEFT JOIN public.profiles p ON p.user_id = cp.user_id
  LEFT JOIN public.contests c ON c.id = cp.contest_id
  WHERE cp.is_winner = true
  ORDER BY cp.joined_at DESC;
$$;