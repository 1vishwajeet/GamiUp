-- Update the admin function to only return participants from admin-created contests
-- This excludes participants from custom challenges (user-created contests)
CREATE OR REPLACE FUNCTION public.get_admin_contest_participants()
 RETURNS TABLE(id uuid, user_id uuid, contest_id uuid, transaction_id text, payment_id text, payment_status text, joined_at timestamp with time zone, score integer, result_screenshot text, is_winner boolean, prize_amount numeric, game_id text)
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
    cp.game_id
  FROM public.contest_participants cp
  INNER JOIN public.contests c ON c.id = cp.contest_id
  WHERE c.created_by IS NULL  -- Only admin-created contests (created_by is null for admin contests)
  ORDER BY cp.joined_at DESC;
$function$