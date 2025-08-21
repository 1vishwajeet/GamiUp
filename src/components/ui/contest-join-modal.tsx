import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


interface ContestJoinModalProps {
  contest: any;
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onJoinSuccess?: () => void;
}

export function ContestJoinModal({ contest, isOpen, onClose, userProfile, onJoinSuccess }: ContestJoinModalProps) {
  const [gameId, setGameId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check for payment redirect verification on component mount
  useEffect(() => {
    const verifyPaymentOnReturn = async () => {
      try {
        const orderId = localStorage.getItem('cf_contest_order_id');
        const contestData = localStorage.getItem('cf_contest_data');
        
        if (orderId && contestData && isOpen) {
          console.log('🔄 Verifying contest join payment after redirect...', { orderId });
          
          const parsedData = JSON.parse(contestData);
          const { error } = await supabase.functions.invoke('verify-payment', {
            body: {
              cashfree_order_id: orderId,
              contestId: parsedData.contestId,
              gameId: parsedData.gameId
            }
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
            // Joined via post-redirect verification
          }

          // Clean up localStorage
          localStorage.removeItem('cf_contest_order_id');
          localStorage.removeItem('cf_contest_data');
          onClose();
        }
      } catch (error: any) {
        console.error('Error verifying contest join payment on return:', error);
      }
    };

    verifyPaymentOnReturn();
  }, [isOpen, onJoinSuccess, onClose]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  

  const getGameIdLabel = (game: string) => {
    const gameLabels: { [key: string]: string } = {
      'PUBG': 'PUBG Player ID',
      'Free Fire': 'Free Fire ID',
      'COD Mobile': 'COD Mobile ID',
      'BGMI': 'BGMI Player ID',
      'Valorant': 'Valorant ID',
      'Clash Royale': 'Clash Royale Player Tag',
      'Clash of Clans': 'Clash of Clans Player Tag'
    };
    return gameLabels[game] || `${game} Game ID`;
  };

  const handlePayment = async () => {
    if (!gameId.trim()) {
      toast({
        title: "Game ID Required",
        description: `Please enter your ${getGameIdLabel(contest.game)}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Ensure Cashfree Checkout is loaded
      if (!(window as any).Cashfree) {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // First test debug function
      console.log('🧪 Testing debug function first...');
      const debugResponse = await supabase.functions.invoke('debug-cashfree');
      console.log('🧪 Debug function response:', debugResponse);

      // Create Cashfree order
      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: {
          contestId: contest.id,
          amount: contest.entry_fee,
          gameId: gameId.trim()
        }
      });

      if (error) throw error;

      console.log('✅ create-payment-order response:', data);
      if (data?.success === false) {
        console.error('❌ Payment init error:', data);
        toast({
          title: 'Payment Setup Error',
          description: typeof data.details === 'string' ? data.details : (data.details?.message || data.error || 'Payment could not be initiated.'),
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      const sessionId = (data?.payment_session_id ?? '').toString().trim();
      console.log('🧪 payment_session_id length:', sessionId.length, 'preview:', sessionId.slice(0,8) + '...');
      if (!sessionId) {
        console.error('❌ Missing payment_session_id in response:', data);
        toast({
          title: 'Payment Setup Error',
          description: 'Payment session not received. Please try again.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Store payment data for post-redirect verification
      try {
        localStorage.setItem('cf_contest_order_id', data.order_id);
        localStorage.setItem('cf_contest_data', JSON.stringify({ contestId: contest.id, gameId: gameId.trim() }));
      } catch (e) {
        console.warn('Could not store payment data in localStorage:', e);
      }

      // Close the parent modal completely to avoid backdrop conflicts
      onClose();
      setIsProcessing(false);

      // Wait a bit for modal to close completely
      await new Promise(resolve => setTimeout(resolve, 500));


      // Initialize Cashfree Checkout
      const cashfree = (window as any).Cashfree({
        mode: "production"
      });

      // Open Cashfree checkout
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self" // or "_blank" for new tab
      };

      cashfree.checkout(checkoutOptions).then(function(result: any) {
        if (result.error) {
          console.error('Cashfree error:', result.error);
          toast({
            title: "Payment Failed",
            description: result.error.message || "Payment failed. Please try again.",
            variant: "destructive",
          });
        }
        if (result.redirect) {
          console.log("Redirecting to payment page...");
        }
        if (result.paymentDetails) {
          console.log("Payment completed:", result.paymentDetails);
          // Payment successful - verify payment
          verifyPayment(result.paymentDetails, data.order_id);
        }
      }).catch(function(error: any) {
        console.error('Cashfree checkout error:', error);
        toast({
          title: "Payment Failed",
          description: "Failed to open payment gateway. Please try again.",
          variant: "destructive",
        });
      });
      
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (paymentDetails: any, orderId: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: {
          cashfree_order_id: orderId,
          contestId: contest.id,
          gameId: gameId.trim()
        }
      });

      if (error) throw error;

      toast({
        title: "🎉 Contest Joined Successfully!",
        description: "Payment confirmed! You have successfully joined the contest.",
      });

      onClose();
      setGameId("");
      
      // Call success callback to refresh joined contests
      if (onJoinSuccess) {
        onJoinSuccess();
      }
      
      // Redirect to dashboard with success message
      window.location.href = "/gamer-place?payment=success";
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Verification Failed",
        description: error.message || "Payment verification failed. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join Contest</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contest Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{contest.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Game:</span>
                  <Badge variant="secondary">{contest.game}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="font-semibold">₹{contest.entry_fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prize Pool:</span>
                  <span className="font-semibold text-green-600">₹{contest.prize_pool}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game ID Input */}
          <div className="space-y-2">
            <Label htmlFor="gameId">{getGameIdLabel(contest.game)} *</Label>
            <Input
              id="gameId"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder={`Enter your ${getGameIdLabel(contest.game)}`}
              required
            />
          </div>

          {/* User Details */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Your Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{userProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp:</span>
                  <span>{userProfile.whatsapp_number || 'Not provided'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Go Back
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Make Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}