-- Add image_updated_at field to track when contest images are updated
ALTER TABLE public.contests 
ADD COLUMN image_updated_at timestamp with time zone DEFAULT now();

-- Create a trigger to update image_updated_at when image_url changes
CREATE OR REPLACE FUNCTION update_image_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update timestamp if image_url has actually changed
  IF OLD.image_url IS DISTINCT FROM NEW.image_url THEN
    NEW.image_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_contests_image_timestamp
  BEFORE UPDATE ON public.contests
  FOR EACH ROW
  EXECUTE FUNCTION update_image_timestamp();