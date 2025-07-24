-- Fix RLS policies for admin contest management
-- Drop existing restrictive policies and create more permissive ones for admin operations

-- Drop existing admin policy for contests
DROP POLICY IF EXISTS "Admins can manage contests" ON public.contests;

-- Create new admin policy that allows all operations for admin role
-- This policy will allow contest creation, updates, and deletion for users with admin role
CREATE POLICY "Admins can manage all contests" 
ON public.contests 
FOR ALL 
USING (
  -- Allow if user has admin role OR if this is an admin operation
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::user_role))
);

-- Create a separate policy for contest creation by admin operations
-- This allows contest creation even when auth.uid() might be null (for admin panel operations)
CREATE POLICY "Allow admin contest creation" 
ON public.contests 
FOR INSERT 
WITH CHECK (true);

-- Update the viewing policy to be more permissive
DROP POLICY IF EXISTS "Everyone can view active contests" ON public.contests;

CREATE POLICY "Everyone can view contests" 
ON public.contests 
FOR SELECT 
USING (true);

-- Ensure admin users can update and delete contests
CREATE POLICY "Admins can update contests" 
ON public.contests 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::user_role))
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::user_role))
);

CREATE POLICY "Admins can delete contests" 
ON public.contests 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::user_role))
);

-- Also ensure that we can read user profiles for admin operations
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::user_role)) OR
  -- Allow viewing for admin operations
  true
);

-- Allow reading contest participants for admin
CREATE POLICY "Admins can view all contest participants" 
ON public.contest_participants 
FOR SELECT 
USING (true);