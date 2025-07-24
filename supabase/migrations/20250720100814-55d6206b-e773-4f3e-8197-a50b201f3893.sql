-- First, create a historical contests table to preserve contest info
CREATE TABLE IF NOT EXISTS public.contests_history (
  id uuid NOT NULL,
  title text NOT NULL,
  description text,
  game text NOT NULL,
  entry_fee numeric NOT NULL,
  prize_pool numeric NOT NULL,
  first_prize numeric DEFAULT 0.00,
  second_prize numeric DEFAULT 0.00,
  third_prize numeric DEFAULT 0.00,
  max_participants integer NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status text DEFAULT 'ended',
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone DEFAULT now(),
  participant_count integer DEFAULT 0,
  PRIMARY KEY (id)
);

-- Enable RLS on contests_history
ALTER TABLE public.contests_history ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view contest history
CREATE POLICY "Admins can view contest history" 
ON public.contests_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));