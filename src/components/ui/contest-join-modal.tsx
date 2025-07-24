import { useState } from "react";
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
      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: {
          contestId: contest.id,
          amount: contest.entry_fee,
          gameId: gameId.trim()
        }
      });

      if (error) throw error;

      // Open Razorpay checkout
      const options = {
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Match Arena Kings",
        description: `Entry fee for ${contest.title}`,
        order_id: data.order_id,
        handler: function (response: any) {
          // Payment successful - verify payment
          verifyPayment(response, data.order_id);
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.whatsapp_number
        },
        theme: {
          color: "#9333ea"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
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

  const verifyPayment = async (response: any, orderId: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
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