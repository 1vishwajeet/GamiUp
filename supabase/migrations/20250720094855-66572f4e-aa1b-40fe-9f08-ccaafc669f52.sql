-- Enable realtime for contests table so changes are immediately reflected
ALTER PUBLICATION supabase_realtime ADD TABLE public.contests;

-- Set replica identity to full to ensure complete row data is captured during updates
ALTER TABLE public.contests REPLICA IDENTITY FULL;