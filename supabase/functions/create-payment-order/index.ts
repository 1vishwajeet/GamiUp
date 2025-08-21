
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

    // Get user profile for phone number
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('whatsapp_number')
      .eq('user_id', user.id)
      .single();

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

    // Validate Cashfree credentials - check all possible secret names
    let cashfreeAppId = Deno.env.get('CASHFREE_APP_ID_NEW') || Deno.env.get('CASHFREE_APP_ID');
    let cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY_NEW') || Deno.env.get('CASHFREE_SECRET_KEY') || Deno.env.get('CASHFREE_SECRETE_KEY');
    
    console.log('🔑 Cashfree credentials check FINAL-v5:', {
      appId: cashfreeAppId ? `${cashfreeAppId.substring(0, 8)}...` : 'MISSING',
      secretKey: cashfreeSecretKey ? `${cashfreeSecretKey.substring(0, 8)}...` : 'MISSING',
      environment: Deno.env.get('CASHFREE_ENV'),
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(key => key.includes('CASHFREE')),
      testNewSecrets: {
        newAppId: !!Deno.env.get('CASHFREE_APP_ID_NEW'),
        newSecretKey: !!Deno.env.get('CASHFREE_SECRET_KEY_NEW')
      }
    });
    
    if (!cashfreeAppId || !cashfreeSecretKey) {
      console.error('❌ Missing Cashfree credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment service not configured properly - missing credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create Cashfree order
    const timestamp = Date.now().toString().slice(-8);
    const userIdShort = user.id.slice(-8);
    const contestIdShort = contestId.slice(-8);
    
    const orderData = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: `contest_${contestIdShort}_${userIdShort}_${timestamp}`,
      customer_details: {
        customer_id: user.id,
        customer_email: user.email || 'user@example.com',
        customer_phone: userProfile?.whatsapp_number ? 
          (userProfile.whatsapp_number.startsWith('+91') ? userProfile.whatsapp_number.slice(3) : userProfile.whatsapp_number) : 
          '9999999999'
      },
      order_meta: {
        return_url: `https://www.gamizn.in/gamer-place?payment=success`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment`
      },
      order_note: `Contest ${contestId} payment by ${user.id}`
    };

    console.log('📝 Creating Cashfree order:', JSON.stringify(orderData, null, 2));
    console.log('🌐 Making request to:', `${CF_BASE_URL}/pg/orders`);

    const cashfreeResponse = await fetch(`${CF_BASE_URL}/pg/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(orderData),
    });

    console.log('📡 Cashfree response status:', cashfreeResponse.status);
    console.log('📡 Cashfree response headers:', Object.fromEntries(cashfreeResponse.headers.entries()));
    
    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.text();
      console.error('❌ Cashfree API Error Status:', cashfreeResponse.status);
      console.error('❌ Cashfree API Error Response:', errorData);
      console.error('❌ Request URL:', `${CF_BASE_URL}/pg/orders`);
      console.error('❌ Request body:', JSON.stringify(orderData, null, 2));
      console.error('❌ Request headers:', {
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey ? `${cashfreeSecretKey.substring(0, 8)}...` : 'MISSING',
        'x-api-version': '2023-08-01'
      });

      let parsed: any = null;
      try { parsed = JSON.parse(errorData); } catch {}

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment service error',
          details: parsed || errorData,
          status: cashfreeResponse.status,
          cashfree_error: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const order = await cashfreeResponse.json();
    console.log('Cashfree order created:', order.order_id);

    // Store payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        contest_id: contestId,
        cashfree_order_id: order.order_id,
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
        success: true,
        order_id: order.order_id,
        payment_session_id: order.payment_session_id,
        amount: order.order_amount,
        currency: order.order_currency,
        cashfree_app_id: cashfreeAppId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Error in create-payment-order:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
