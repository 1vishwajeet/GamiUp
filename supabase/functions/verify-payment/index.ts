import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Cashfree base URL with smart fallback (handles live/sandbox mismatch)
const CF_BASE_URLS = (() => {
  const env = (Deno.env.get('CASHFREE_ENV') || 'sandbox').toLowerCase();
  const isProduction = env === 'live' || env === 'prod' || env === 'production';
  const primary = isProduction ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
  const fallback = isProduction ? 'https://sandbox.cashfree.com' : 'https://api.cashfree.com';
  console.log(`🚀 Cashfree Environment: ${env}, Is Production: ${isProduction}, Primary URL: ${primary}, Fallback URL: ${fallback}`);
  return [primary, fallback];
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
    // Check if there's an auth header (client call) or not (webhook call)
    const authHeader = req.headers.get('Authorization');

    let supabaseClient: ReturnType<typeof createClient>;
    let authedUserId: string | null = null;

    if (authHeader) {
      // Client-side call with auth
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: { headers: { Authorization: authHeader } },
        }
      );
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError) console.warn('Auth getUser error (non-fatal):', userError);
      authedUserId = user?.id ?? null;
    } else {
      // Webhook call - use service role
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
    }

    // Parse request body (be tolerant of missing/alternate structures)
    let json: any = {};
    try {
      if ((req.headers.get('content-type') || '').includes('application/json')) {
        json = await req.json();
      } else {
        // Try form data (Cashfree sometimes posts urlencoded)
        const form = await req.formData();
        form.forEach((v, k) => (json[k] = v));
      }
    } catch (_) {
      // Ignore body parse errors – we'll handle undefined values below
    }

    const cashfree_order_id = json?.cashfree_order_id || json?.order_id || json?.data?.order?.order_id || json?.data?.order_id;
    const contestIdFromClient = json?.contestId;
    const gameIdFromClient = json?.gameId;

    console.log('📝 Payment verification request data:', {
      cashfree_order_id,
      contestId: contestIdFromClient,
      gameId: gameIdFromClient,
    });

    if (!cashfree_order_id) {
      throw new Error('Missing order id');
    }

    // Find the payment record; if authed, constrain by user for safety
    let paymentQuery = supabaseClient
      .from('payments')
      .select('id, user_id, amount, contest_id, status, participant_id')
      .eq('cashfree_order_id', cashfree_order_id);

    if (authedUserId) {
      paymentQuery = paymentQuery.eq('user_id', authedUserId);
    }

    const { data: paymentRecord, error: paymentError } = await paymentQuery.maybeSingle();
    if (paymentError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    const finalUserId = paymentRecord.user_id;
    const finalContestId = contestIdFromClient || paymentRecord.contest_id;
    const finalGameId = gameIdFromClient || undefined; // optional

    if (!finalContestId) {
      throw new Error('Contest not found for this payment');
    }

    // Verify payment with Cashfree (with fallback URLs and flexible secrets)
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID_NEW') || Deno.env.get('CASHFREE_APP_ID');
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY_NEW') || Deno.env.get('CASHFREE_SECRET_KEY') || Deno.env.get('CASHFREE_SECRETE_KEY');

    let orderData: any = null;
    let lastStatus = 0;
    let lastText = '';
    for (const base of CF_BASE_URLS) {
      try {
        const res = await fetch(`${base}/pg/orders/${cashfree_order_id}`, {
          method: 'GET',
          headers: {
            'x-client-id': cashfreeAppId,
            'x-client-secret': cashfreeSecretKey,
            'x-api-version': '2023-08-01',
          },
        });
        if (res.ok) {
          orderData = await res.json();
          console.log(`✅ Cashfree verify success via ${base}`, { status: orderData?.order_status });
          break;
        } else {
          lastStatus = res.status;
          lastText = await res.text();
          console.warn(`⚠️ Cashfree verify failed via ${base}`, { status: res.status, body: lastText?.slice(0, 200) });
        }
      } catch (e) {
        console.warn(`⚠️ Cashfree verify error via ${base}`, e);
      }
    }

    if (!orderData) {
      throw new Error(`Payment verification failed (status: ${lastStatus})`);
    }

    if (orderData.order_status !== 'PAID') {
      console.log('❌ Payment not completed:', orderData.order_status);
      throw new Error('Payment not completed');
    }

    console.log('✅ Payment verified successfully');

    // Update payment record to completed
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        cashfree_payment_id: orderData.cf_order_id,
        status: 'completed',
      })
      .eq('cashfree_order_id', cashfree_order_id)
      .eq('user_id', finalUserId);

    if (paymentUpdateError) {
      console.error('Payment update error:', paymentUpdateError);
      throw new Error('Failed to update payment record');
    }

    // Idempotency: if participant already exists for this order or user+contest, return success
    const { data: existingParticipant } = await supabaseClient
      .from('contest_participants')
      .select('id')
      .or(
        `and(user_id.eq.${finalUserId},contest_id.eq.${finalContestId},transaction_id.eq.${cashfree_order_id}),and(user_id.eq.${finalUserId},contest_id.eq.${finalContestId},payment_id.eq.${orderData.cf_order_id})`
      )
      .maybeSingle();

    if (existingParticipant) {
      console.log('ℹ️ Participant already exists for this payment; returning success');
      return new Response(
        JSON.stringify({ success: true, message: 'Already joined contest' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create contest participant entry
    const { data: inserted, error: participantError } = await supabaseClient
      .from('contest_participants')
      .insert({
        user_id: finalUserId,
        contest_id: finalContestId,
        game_id: finalGameId,
        payment_id: orderData.cf_order_id,
        payment_status: 'completed',
        transaction_id: cashfree_order_id,
        joined_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (participantError) {
      console.error('Participant creation error:', participantError);
      throw new Error('Failed to join contest');
    }

    // Update payment record with participant reference
    await supabaseClient
      .from('payments')
      .update({ participant_id: inserted.id })
      .eq('id', paymentRecord.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified and contest joined successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
