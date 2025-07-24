-- Create storage bucket for contest screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('contest-screenshots', 'contest-screenshots', true);

-- Create policies for contest screenshot uploads
CREATE POLICY "Users can upload their own contest screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'contest-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Contest screenshots are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'contest-screenshots');

CREATE POLICY "Users can update their own contest screenshots" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'contest-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);