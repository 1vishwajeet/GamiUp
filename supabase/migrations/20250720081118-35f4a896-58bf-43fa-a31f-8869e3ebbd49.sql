-- Enable realtime for admin dashboard tables
-- Add tables to realtime publication so admin panel gets live updates

-- Enable replica identity full for all tables to get complete data
ALTER TABLE public.contest_participants REPLICA IDENTITY FULL;
ALTER TABLE public.contests REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;