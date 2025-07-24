-- Fix the existing contest timezone issue
-- Convert the stored UTC time to what the admin actually intended (local IST time)
UPDATE contests 
SET 
  start_date = start_date - INTERVAL '5 hours 30 minutes',
  end_date = end_date - INTERVAL '5 hours 30 minutes',
  updated_at = now()
WHERE id = '60f7bc52-b6ad-48c8-899e-cf0f41889721';