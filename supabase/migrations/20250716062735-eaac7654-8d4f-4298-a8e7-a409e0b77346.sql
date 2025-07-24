-- Fix storage policies for contest screenshots
DROP POLICY IF EXISTS "Users can upload their own contest screenshots" ON storage.objects;

-- Create simpler policy for uploads that doesn't require folder structure
CREATE POLICY "Anyone can upload contest screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'contest-screenshots');