import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { amount, challengeData } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!challengeData) {
      throw new Error('Challenge data is required');
    }

    // Validate required challenge data
    const requiredFields = ['title', 'game', 'challengeType', 'startDate', 'startTime', 'endDate', 'endTime'];
    for (const field of requiredFields) {
      if (!challengeData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_TEST_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_TEST_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Create Razorpay order
    const razorpayOrderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `custom_challenge_${Date.now()}`,
        notes: {
          user_id: user.id,
          challenge_title: challengeData.title,
          challenge_type: challengeData.challengeType,
          game: challengeData.game
        }
      }),
    });

    if (!razorpayOrderResponse.ok) {
      const errorText = await razorpayOrderResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      throw new Error('Failed to create payment order');
    }

    const razorpayOrder = await razorpayOrderResponse.json();

    // Store payment record in custom_contest_payments table
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('custom_contest_payments')
      .insert({
        user_id: user.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    console.log('Custom contest payment order created:', {
      orderId: razorpayOrder.id,
      amount: amount,
      userId: user.id,
      challengeTitle: challengeData.title
    });

    return new Response(
      JSON.stringify({
        razorpay_order_id: razorpayOrder.id,
        razorpay_key_id: razorpayKeyId,
        amount: amount,
        currency: 'INR',
        payment_id: paymentData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in create-custom-contest-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});