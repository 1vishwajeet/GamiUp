-- Fix admin access for contest_participants table
-- First, let's check existing policies
DROP POLICY IF EXISTS "Admins can view all contest participants" ON public.contest_participants;

-- Create proper admin policy for contest participants
CREATE POLICY "Admins can view all contest participants" 
ON public.contest_participants 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

-- Also ensure admins can view profiles and contests tables
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role) OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all contests" ON public.contests;  
CREATE POLICY "Admins can view all contests"
ON public.contests
FOR SELECT  
USING (true);