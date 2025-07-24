-- Add foreign key constraints to link tables properly
-- This will fix the relationship errors in the admin queries

-- Add foreign key from contest_participants to profiles
ALTER TABLE public.contest_participants 
ADD CONSTRAINT fk_contest_participants_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key from contest_participants to contests  
ALTER TABLE public.contest_participants 
ADD CONSTRAINT fk_contest_participants_contest_id 
FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;

-- Add foreign key from payments to profiles
ALTER TABLE public.payments 
ADD CONSTRAINT fk_payments_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key from payments to contests
ALTER TABLE public.payments 
ADD CONSTRAINT fk_payments_contest_id 
FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE CASCADE;