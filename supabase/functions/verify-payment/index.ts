import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CF_BASE_URL = (() => {
  const env = (Deno.env.get('CASHFREE_ENV') || 'sandbox').toLowerCase();
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

  console.log('🔍 Verify payment function called');

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      cashfree_order_id,
      contestId,
      gameId
    } = await req.json();

    console.log('📝 Payment verification request data:', {
      cashfree_order_id,
      contestId,
      gameId
    });

    // Get the payment record to find the user_id
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .select('user_id, amount')
      .eq('cashfree_order_id', cashfree_order_id)
      .single();

    if (paymentError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    const userId = paymentRecord.user_id;

    // Verify payment with Cashfree
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID');
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY');

    const verifyResponse = await fetch(`${CF_BASE_URL}/pg/orders/${cashfree_order_id}`, {
      method: 'GET',
      headers: {
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
        'x-api-version': '2023-08-01'
      }
    });

    if (!verifyResponse.ok) {
      throw new Error('Payment verification failed');
    }

    const orderData = await verifyResponse.json();
    
    console.log('💳 Cashfree verification response:', {
      status: orderData.order_status,
      orderId: cashfree_order_id
    });
    
    if (orderData.order_status !== 'PAID') {
      console.log('❌ Payment not completed:', orderData.order_status);
      throw new Error('Payment not completed');
    }

    console.log('✅ Payment verified successfully');

    // Update payment record
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        cashfree_payment_id: orderData.cf_order_id,
        status: 'completed'
      })
      .eq('cashfree_order_id', cashfree_order_id)
      .eq('user_id', userId);

    if (paymentUpdateError) {
      console.error('Payment update error:', paymentUpdateError);
      throw new Error('Failed to update payment record');
    }

    // Get the updated payment record
    const { data: paymentData, error: paymentFetchError } = await supabaseClient
      .from('payments')
      .select('id')
      .eq('cashfree_order_id', cashfree_order_id)
      .eq('user_id', userId)
      .single();

    if (paymentFetchError || !paymentData) {
      throw new Error('Payment record not found');
    }

    // Create contest participant entry
    const { error: participantError } = await supabaseClient
      .from('contest_participants')
      .insert({
        user_id: userId,
        contest_id: contestId,
        game_id: gameId,
        payment_id: orderData.cf_order_id,
        payment_status: 'completed',
        transaction_id: cashfree_order_id,
        joined_at: new Date().toISOString()
      });

    if (participantError) {
      console.error('Participant creation error:', participantError);
      throw new Error('Failed to join contest');
    }

    // Update payment record with participant reference
    const { data: participantData } = await supabaseClient
      .from('contest_participants')
      .select('id')
      .eq('user_id', userId)
      .eq('contest_id', contestId)
      .eq('payment_id', orderData.cf_order_id)
      .single();

    if (participantData) {
      await supabaseClient
        .from('payments')
        .update({ participant_id: participantData.id })
        .eq('id', paymentData.id);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified and contest joined successfully' }),
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