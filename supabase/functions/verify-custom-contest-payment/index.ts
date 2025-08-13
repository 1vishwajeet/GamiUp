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

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      challengeData
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !challengeData) {
      throw new Error('Missing required payment or challenge data');
    }

    // Get the payment record to find the user_id
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('custom_contest_payments')
      .select('user_id, amount')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    // Verify Razorpay signature using Web Crypto API
    const keyData = new TextEncoder().encode(Deno.env.get('RAZORPAY_TEST_KEY_SECRET') || '');
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
      .from('custom_contest_payments')
      .update({
        razorpay_payment_id,
        status: 'completed'
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id);

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
        created_by: user.id,
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
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id);

    if (linkError) {
      console.error('Failed to link payment to contest:', linkError);
    }

    // Automatically join the creator to their own contest
    const { error: participantError } = await supabaseClient
      .from('contest_participants')
      .insert({
        user_id: user.id,
        contest_id: contestData.id,
        game_id: challengeData.challengeType,
        payment_id: razorpay_payment_id,
        payment_status: 'completed',
        transaction_id: razorpay_order_id,
        joined_at: new Date().toISOString()
      });

    if (participantError) {
      console.error('Participant creation error:', participantError);
      // Don't throw error here as contest is already created
    }

    console.log('Custom contest created successfully:', {
      contestId: contestData.id,
      title: challengeData.title,
      createdBy: user.id,
      paymentId: razorpay_payment_id
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