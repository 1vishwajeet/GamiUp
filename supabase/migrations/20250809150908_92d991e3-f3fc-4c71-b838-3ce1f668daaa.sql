-- Drop and recreate the get_admin_custom_challenges function to include challenge type
DROP FUNCTION IF EXISTS public.get_admin_custom_challenges();

CREATE OR REPLACE FUNCTION public.get_admin_custom_challenges()
 RETURNS TABLE(id uuid, title text, description text, game text, entry_fee numeric, first_prize numeric, second_prize numeric, third_prize numeric, max_participants integer, start_date timestamp with time zone, end_date timestamp with time zone, status text, created_at timestamp with time zone, created_by uuid, creator_name text, creator_contact text, participant_count bigint, payment_status text, challenge_type text)
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
    COALESCE(ccp.status, 'pending') as payment_status,
    COALESCE(
      (SELECT cp.game_id FROM public.contest_participants cp WHERE cp.contest_id = c.id LIMIT 1), 
      'Custom'
    ) as challenge_type
  FROM public.contests c
  LEFT JOIN public.profiles p ON p.user_id = c.created_by
  LEFT JOIN public.custom_contest_payments ccp ON ccp.contest_id = c.id
  WHERE c.created_by IS NOT NULL
  ORDER BY c.created_at DESC;
$function$