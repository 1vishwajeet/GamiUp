import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/gamer-place/Dashboard";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GamerPlace = () => {
  const { loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleReturn = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
          toast({
            title: "Payment Successful! 🎉",
            description: "Verifying your contest join...",
          });
        }

        const orderId = localStorage.getItem('cf_contest_order_id');
        const contestData = localStorage.getItem('cf_contest_data');

        if (orderId && contestData) {
          const parsed = JSON.parse(contestData);
          console.log('🔄 Verifying contest join payment after redirect...', { orderId, parsed });

          const { error } = await supabase.functions.invoke('verify-payment', {
            body: {
              cashfree_order_id: orderId,
              contestId: parsed.contestId,
              gameId: parsed.gameId,
            },
          });

          if (error) {
            console.error('❌ Contest join verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          } else {
            console.log('✅ Contest joined successfully after redirect');
            toast({
              title: "Contest Joined! 🎉",
              description: "You have successfully joined the contest. Good luck!",
            });
          }

          localStorage.removeItem('cf_contest_order_id');
          localStorage.removeItem('cf_contest_data');
        }

        if (urlParams.get('payment') === 'success') {
          window.history.replaceState({}, '', '/gamer-place');
        }
      } catch (err) {
        console.error('Error verifying contest join on return:', err);
      }
    };

    handleReturn();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Since this component is wrapped in ProtectedRoute, 
  // we only reach here if user is authenticated
  return <Dashboard />;
};

export default GamerPlace;