import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Debug function started');
    
    // Get all environment variables that contain CASHFREE
    const allEnv = Deno.env.toObject();
    const cashfreeKeys = Object.keys(allEnv).filter(key => key.includes('CASHFREE'));
    
    console.log('🔍 All CASHFREE environment variables:', cashfreeKeys);
    
    const cashfreeDebug = {
      CASHFREE_APP_ID: {
        exists: !!Deno.env.get('CASHFREE_APP_ID'),
        value: Deno.env.get('CASHFREE_APP_ID') ? `${Deno.env.get('CASHFREE_APP_ID')?.substring(0, 10)}...` : 'MISSING'
      },
      CASHFREE_SECRET_KEY: {
        exists: !!Deno.env.get('CASHFREE_SECRET_KEY'),
        value: Deno.env.get('CASHFREE_SECRET_KEY') ? `${Deno.env.get('CASHFREE_SECRET_KEY')?.substring(0, 10)}...` : 'MISSING'
      },
      CASHFREE_SECRETE_KEY: {
        exists: !!Deno.env.get('CASHFREE_SECRETE_KEY'),
        value: Deno.env.get('CASHFREE_SECRETE_KEY') ? `${Deno.env.get('CASHFREE_SECRETE_KEY')?.substring(0, 10)}...` : 'MISSING'
      },
      CASHFREE_ENV: {
        exists: !!Deno.env.get('CASHFREE_ENV'),
        value: Deno.env.get('CASHFREE_ENV') || 'MISSING'
      },
      allCashfreeKeys: cashfreeKeys
    };
    
    console.log('🔍 Cashfree environment debug:', JSON.stringify(cashfreeDebug, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        debug: cashfreeDebug,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('🔍 Debug function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});