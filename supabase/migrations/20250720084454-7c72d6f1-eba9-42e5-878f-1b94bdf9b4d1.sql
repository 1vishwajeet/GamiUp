-- Fix admin delete permissions for contests and contest_participants
-- The admin should be able to delete contests and related participants

-- Drop existing policies if they exist and recreate with proper permissions
DROP POLICY IF EXISTS "Admins can delete contests" ON public.contests;
DROP POLICY IF EXISTS "Admins can delete contest participants" ON public.contest_participants;

-- Allow admins to delete contests
CREATE POLICY "Admins can delete contests" 
ON public.contests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Allow admins to delete contest participants  
CREATE POLICY "Admins can delete contest participants" 
ON public.contest_participants 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Also ensure admins can manage all operations on contest_participants
DROP POLICY IF EXISTS "Admins can manage all participations" ON public.contest_participants;
CREATE POLICY "Admins can manage all participations" 
ON public.contest_participants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));