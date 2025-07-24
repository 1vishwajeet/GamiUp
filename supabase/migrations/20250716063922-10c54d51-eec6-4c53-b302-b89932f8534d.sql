-- Add columns to contest_participants for game details and payment info
ALTER TABLE public.contest_participants 
ADD COLUMN game_id TEXT,
ADD COLUMN payment_id TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN transaction_id TEXT;

-- Create table to store payment details
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contest_id UUID NOT NULL,
  participant_id UUID REFERENCES public.contest_participants(id),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all payments" 
ON public.payments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));