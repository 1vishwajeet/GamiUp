-- Create admin function to get dashboard stats
-- This will bypass RLS for admin dashboard statistics

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  total_users bigint,
  total_contests bigint,
  active_contests bigint,
  total_entries bigint,
  new_users_today bigint,
  contests_created_today bigint,
  payments_processed_today bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM public.contests)::bigint as total_contests,
    (SELECT COUNT(*) FROM public.contests WHERE status = 'active')::bigint as active_contests,
    (SELECT COUNT(*) FROM public.contest_participants)::bigint as total_entries,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= CURRENT_DATE)::bigint as new_users_today,
    (SELECT COUNT(*) FROM public.contests WHERE created_at >= CURRENT_DATE)::bigint as contests_created_today,
    (SELECT COUNT(*) FROM public.contest_participants WHERE joined_at >= CURRENT_DATE)::bigint as payments_processed_today;
$$;