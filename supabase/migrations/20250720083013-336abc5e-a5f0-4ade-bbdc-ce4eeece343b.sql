-- Fix RLS policies to allow public access to contests
-- Users need to see contests to join them

-- Update contests policies to allow public read access
DROP POLICY IF EXISTS "Everyone can view contests" ON public.contests;

-- Create new policy that allows everyone to view contests (including non-authenticated users)
CREATE POLICY "Public can view contests" 
ON public.contests 
FOR SELECT 
USING (true);

-- Also ensure contest_participants can be read by users to check join status
DROP POLICY IF EXISTS "Users can view their own participations" ON public.contest_participants;

CREATE POLICY "Users can view participations" 
ON public.contest_participants 
FOR SELECT 
USING (true);

-- Allow public to view profiles for leaderboard purposes
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);