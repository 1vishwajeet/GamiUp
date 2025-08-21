import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CF_BASE_URL = (() => {
  const env = (Deno.env.get('CASHFREE_ENV') || 'live').toLowerCase();
  const isProduction = env === 'live' || env === 'prod' || env === 'production';
  const baseUrl = isProduction ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
  console.log(`🚀 Cashfree Environment: ${env}, Is Production: ${isProduction}, Base URL: ${baseUrl}`);
  return baseUrl;
})();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Function SANDBOX-TEST started');
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

    // Get user profile for phone number  
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('whatsapp_number')
      .eq('user_id', user.id)
      .single();

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

    // Get Cashfree credentials - check all possible secret names
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID_NEW') || Deno.env.get('CASHFREE_APP_ID');
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY_NEW') || Deno.env.get('CASHFREE_SECRET_KEY') || Deno.env.get('CASHFREE_SECRETE_KEY');

    console.log('Cashfree credentials check FINAL-v5:', { 
      hasAppId: !!cashfreeAppId, 
      hasSecretKey: !!cashfreeSecretKey,
      environment: Deno.env.get('CASHFREE_ENV'),
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(key => key.includes('CASHFREE')),
      testNewSecrets: {
        newAppId: !!Deno.env.get('CASHFREE_APP_ID_NEW'),
        newSecretKey: !!Deno.env.get('CASHFREE_SECRET_KEY_NEW')
      }
    });

    if (!cashfreeAppId || !cashfreeSecretKey) {
      console.error('Missing Cashfree credentials:', { cashfreeAppId: !!cashfreeAppId, cashfreeSecretKey: !!cashfreeSecretKey });
      return new Response(
        JSON.stringify({ success: false, error: 'Cashfree credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create Cashfree order
    const cashfreeOrderResponse = await fetch(`${CF_BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify({
        order_amount: amount,
        order_currency: 'INR',
        order_id: `custom_challenge_${Date.now()}`,
      customer_details: {
        customer_id: user.id,
        customer_email: user.email || 'user@example.com',
        customer_phone: userProfile?.whatsapp_number ? 
          (userProfile.whatsapp_number.startsWith('+91') ? userProfile.whatsapp_number.slice(3) : userProfile.whatsapp_number) : 
          '9999999999'
      },
        order_meta: {
          return_url: `https://www.gamizn.com/gamer-place?payment=success`,
          notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-custom-contest-payment`
        },
        order_note: `Custom challenge: ${challengeData.title}`
      }),
    });

    if (!cashfreeOrderResponse.ok) {
      const errorText = await cashfreeOrderResponse.text();
      console.error('Cashfree order creation failed:', errorText);
      throw new Error('Failed to create payment order');
    }

    const cashfreeOrder = await cashfreeOrderResponse.json();

    // Store payment record in custom_contest_payments table
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('custom_contest_payments')
      .insert({
        user_id: user.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        cashfree_order_id: cashfreeOrder.order_id,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    console.log('Custom contest payment order created:', {
      orderId: cashfreeOrder.order_id,
      amount: amount,
      userId: user.id,
      challengeTitle: challengeData.title
    });

    return new Response(
      JSON.stringify({
        cashfree_order_id: cashfreeOrder.order_id,
        cashfree_app_id: cashfreeAppId,
        payment_session_id: cashfreeOrder.payment_session_id,
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