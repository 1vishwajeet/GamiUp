-- Add created_by column to contests table to track custom challenges
ALTER TABLE public.contests ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Create custom_contest_payments table for handling custom challenge payments
CREATE TABLE IF NOT EXISTS public.custom_contest_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  contest_id uuid,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending',
  razorpay_payment_id text,
  razorpay_order_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for custom_contest_payments
ALTER TABLE public.custom_contest_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_contest_payments
CREATE POLICY "Users can view their own custom contest payments" 
ON public.custom_contest_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom contest payments" 
ON public.custom_contest_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update custom contest payments" 
ON public.custom_contest_payments 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_custom_contest_payments_updated_at
BEFORE UPDATE ON public.custom_contest_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();