-- Add prize distribution fields to contests table
ALTER TABLE public.contests 
ADD COLUMN first_prize numeric DEFAULT 0.00,
ADD COLUMN second_prize numeric DEFAULT 0.00,
ADD COLUMN third_prize numeric DEFAULT 0.00;