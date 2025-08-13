-- Fix the custom_contest_payments table to allow null contest_id initially
ALTER TABLE public.custom_contest_payments 
ALTER COLUMN contest_id DROP NOT NULL;