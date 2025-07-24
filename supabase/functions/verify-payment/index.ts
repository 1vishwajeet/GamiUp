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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      contestId,
      gameId
    } = await req.json();

    // Get the payment record to find the user_id
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .select('user_id, amount')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (paymentError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    const userId = paymentRecord.user_id;

    // Verify Razorpay signature using Web Crypto API
    const keyData = new TextEncoder().encode(Deno.env.get('RAZORPAY_KEY_SECRET') || '');
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const dataToSign = new TextEncoder().encode(`${razorpay_order_id}|${razorpay_payment_id}`);
    const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
    const generatedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (generatedSignature !== razorpay_signature) {
      throw new Error('Payment signature verification failed');
    }

    // Update payment record
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        razorpay_payment_id,
        status: 'completed'
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', userId);

    if (paymentUpdateError) {
      console.error('Payment update error:', paymentUpdateError);
      throw new Error('Failed to update payment record');
    }

    // Get the updated payment record
    const { data: paymentData, error: paymentFetchError } = await supabaseClient
      .from('payments')
      .select('id')
      .eq('razorpay_order_id', razorpay_order_id)
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
        payment_id: razorpay_payment_id,
        payment_status: 'completed',
        transaction_id: razorpay_order_id,
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
      .eq('payment_id', razorpay_payment_id)
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