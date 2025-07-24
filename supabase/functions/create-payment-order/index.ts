
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
    console.log('Function started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication failed');
    }
    
    const user = data.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    console.log('User authenticated:', user.id);

    const { contestId, amount, gameId } = await req.json();
    console.log('Request data:', { contestId, amount, gameId });

    // Validate input
    if (!contestId || !amount || !gameId) {
      console.error('Missing fields:', { contestId: !!contestId, amount: !!amount, gameId: !!gameId });
      throw new Error('Missing required fields');
    }

    // Check if user already joined this contest
    const { data: existingParticipant } = await supabaseClient
      .from('contest_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (existingParticipant) {
      throw new Error('You have already joined this contest');
    }

    // Validate Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Missing Razorpay credentials');
      throw new Error('Payment service not configured properly');
    }

    // Create Razorpay order with a shorter receipt ID (max 40 chars)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const userIdShort = user.id.slice(-8); // Last 8 chars of user ID
    const contestIdShort = contestId.slice(-8); // Last 8 chars of contest ID
    
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `c${contestIdShort}u${userIdShort}t${timestamp}`, // Max 40 chars
    };

    console.log('Creating Razorpay order:', orderData);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('Razorpay response status:', razorpayResponse.status);
    
    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API Error Status:', razorpayResponse.status);
      console.error('Razorpay API Error Response:', errorData);
      
      // Parse error response for better error messages
      try {
        const errorJson = JSON.parse(errorData);
        throw new Error(errorJson.error?.description || `Razorpay API Error: ${razorpayResponse.status}`);
      } catch (parseError) {
        throw new Error(`Payment service error: ${razorpayResponse.status} - ${errorData}`);
      }
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay order created:', order.id);

    // Store payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        contest_id: contestId,
        razorpay_order_id: order.id,
        amount: amount,
        status: 'pending'
      });

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    console.log('Payment record created successfully');

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpay_key_id: Deno.env.get('RAZORPAY_KEY_ID'),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
