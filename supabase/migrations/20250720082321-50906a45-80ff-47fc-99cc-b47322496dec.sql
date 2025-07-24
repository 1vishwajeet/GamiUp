-- Create admin functions for Contest Manager and User Management
-- These will bypass RLS for admin access

-- Function to get all contests for admin
CREATE OR REPLACE FUNCTION public.get_admin_contests_full()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  game text,
  entry_fee numeric,
  prize_pool numeric,
  first_prize numeric,
  second_prize numeric,
  third_prize numeric,
  max_participants integer,
  start_date timestamptz,
  end_date timestamptz,
  status text,
  image_url text,
  created_at timestamptz,
  created_by uuid,
  participant_count bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.title,
    c.description,
    c.game,
    c.entry_fee,
    c.prize_pool,
    c.first_prize,
    c.second_prize,
    c.third_prize,
    c.max_participants,
    c.start_date,
    c.end_date,
    c.status,
    c.image_url,
    c.created_at,
    c.created_by,
    (SELECT COUNT(*) FROM public.contest_participants cp WHERE cp.contest_id = c.id) as participant_count
  FROM public.contests c
  ORDER BY c.created_at DESC;
$$;

-- Function to get all users/profiles for admin
CREATE OR REPLACE FUNCTION public.get_admin_users_full()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  email text,
  username text,
  whatsapp_number text,
  wallet_balance numeric,
  games_played integer,
  total_winnings numeric,
  favorite_game text,
  skill_level text,
  achievements text[],
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.email,
    p.username,
    p.whatsapp_number,
    p.wallet_balance,
    p.games_played,
    p.total_winnings,
    p.favorite_game,
    p.skill_level,
    p.achievements,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
$$;