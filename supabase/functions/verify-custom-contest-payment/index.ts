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

  console.log('🔍 Verify custom contest payment function called');

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      cashfree_order_id,
      challengeData
    } = await req.json();

    console.log('📝 Verification request data:', {
      cashfree_order_id,
      challengeDataTitle: challengeData?.title
    });

    if (!cashfree_order_id || !challengeData) {
      throw new Error('Missing required payment or challenge data');
    }

    // Get the payment record to find the user_id
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('custom_contest_payments')
      .select('user_id, amount')
      .eq('cashfree_order_id', cashfree_order_id)
      .single();

    if (paymentError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    const userId = paymentRecord.user_id;

    // Verify payment with Cashfree - use same secret names as create function
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID_NEW') || Deno.env.get('CASHFREE_APP_ID');
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY_NEW') || Deno.env.get('CASHFREE_SECRET_KEY') || Deno.env.get('CASHFREE_SECRETE_KEY');

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
    
    if (orderData.order_status !== 'PAID') {
      console.log('❌ Payment status:', orderData.order_status);
      throw new Error('Payment not completed');
    }

    console.log('✅ Payment verified successfully:', orderData.order_status);

    // Update payment record
    const { error: paymentUpdateError } = await supabaseClient
      .from('custom_contest_payments')
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

    // Prepare contest data - Convert to IST timezone
    const startDateTime = new Date(`${challengeData.startDate}T${challengeData.startTime}+05:30`);
    const endDateTime = new Date(`${challengeData.endDate}T${challengeData.endTime}+05:30`);

    // Create the custom contest
    const { data: contestData, error: contestError } = await supabaseClient
      .from('contests')
      .insert({
        title: challengeData.title,
        description: challengeData.description || `Custom ${challengeData.challengeType} challenge`,
        game: challengeData.game,
        entry_fee: challengeData.entryFee,
        prize_pool: challengeData.prizeAmount,
        first_prize: challengeData.prizeAmount,
        second_prize: 0,
        third_prize: 0,
        max_participants: 2, // Fixed for custom challenges
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        status: 'upcoming',
        created_by: userId,
        image_url: null
      })
      .select()
      .single();

    if (contestError) {
      console.error('Contest creation error:', contestError);
      throw new Error('Failed to create contest');
    }

    // Update payment record with contest ID
    const { error: linkError } = await supabaseClient
      .from('custom_contest_payments')
      .update({ contest_id: contestData.id })
      .eq('cashfree_order_id', cashfree_order_id)
      .eq('user_id', userId);

    if (linkError) {
      console.error('Failed to link payment to contest:', linkError);
    }

    // Automatically join the creator to their own contest
    const { error: participantError } = await supabaseClient
      .from('contest_participants')
      .insert({
        user_id: userId,
        contest_id: contestData.id,
        game_id: challengeData.challengeType,
        payment_id: orderData.cf_order_id,
        payment_status: 'completed',
        transaction_id: cashfree_order_id,
        joined_at: new Date().toISOString()
      });

    if (participantError) {
      console.error('Participant creation error:', participantError);
      // Don't throw error here as contest is already created
    }

    console.log('Custom contest created successfully:', {
      contestId: contestData.id,
      title: challengeData.title,
      createdBy: userId,
      paymentId: orderData.cf_order_id
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Custom contest created successfully',
        contest_id: contestData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in verify-custom-contest-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});