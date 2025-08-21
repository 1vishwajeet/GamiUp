import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { 
  Plus, 
  Calendar,
  Clock,
  Trophy,
  Users,
  Gamepad2,
  DollarSign,
  Zap
} from "lucide-react";

interface CreateCustomChallengeFormData {
  title: string;
  description: string;
  game: string;
  challengeType: string;
  entryFee: number;
  prizeAmount: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const CreateCustomChallengeSection = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCustomChallengeFormData>({
    title: "",
    description: "",
    game: "",
    challengeType: "",
    entryFee: 0,
    prizeAmount: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: ""
  });

  // Check for payment redirect verification on component mount
  useEffect(() => {
    const verifyPaymentOnReturn = async () => {
      try {
        const orderId = localStorage.getItem('cf_custom_order_id');
        const challengeData = localStorage.getItem('cf_custom_challenge_data');
        
        if (orderId && challengeData) {
          console.log('🔄 Verifying custom contest payment after redirect...', { orderId });
          
          const { error } = await supabase.functions.invoke('verify-custom-contest-payment', {
            body: {
              cashfree_order_id: orderId,
              challengeData: JSON.parse(challengeData)
            }
          });

          if (error) {
            console.error('❌ Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          } else {
            console.log('✅ Custom contest created successfully after redirect');
            toast({
              title: "Challenge Created! 🎉",
              description: "Your custom challenge has been created and is now live!",
            });
          }

          // Clean up localStorage
          localStorage.removeItem('cf_custom_order_id');
          localStorage.removeItem('cf_custom_challenge_data');
        }
      } catch (error: any) {
        console.error('Error verifying payment on return:', error);
      }
    };

    if (user) {
      verifyPaymentOnReturn();
    }
  }, [user, toast]);

  const gameOptions = [
    { value: "BGMI", label: "BGMI" },
    { value: "FREEFIRE", label: "Free Fire" }
  ];

  const challengeTypeOptions = [
    { value: "1v1", label: "1v1" },
    { value: "2v2", label: "2v2" },
    { value: "3v3", label: "3v3" },
    { value: "4v4", label: "4v4" }
  ];

  // Handle post-redirect verification from Cashfree
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const orderId = localStorage.getItem('cf_cashfree_order_id');
      const stored = localStorage.getItem('cf_custom_challenge_data');
      if (orderId && stored) {
        const parsed: CreateCustomChallengeFormData = JSON.parse(stored);
        setIsLoading(true);
        supabase.functions
          .invoke('verify-custom-contest-payment', {
            body: {
              cashfree_order_id: orderId,
              challengeData: parsed,
            },
          })
          .then(({ error }) => {
            if (error) {
              console.error('Post-redirect verification error:', error);
              toast({
                title: 'Payment Error',
                description: error.message || 'Failed to verify payment. Please contact support.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: 'Challenge Created! 🎉',
                description: 'Your custom challenge has been created and is now live!',
              });
              setIsOpen(false);
            }
          })
          .finally(() => {
            try {
              localStorage.removeItem('cf_cashfree_order_id');
              localStorage.removeItem('cf_custom_challenge_data');
            } catch (_) {}
            const url = new URL(window.location.href);
            url.searchParams.delete('payment');
            window.history.replaceState({}, '', url.toString());
            setIsLoading(false);
          });
      }
    }
  }, []);


  const handleInputChange = (field: keyof CreateCustomChallengeFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate prize amount when entry fee changes
    if (field === 'entryFee') {
      const fee = Number(value);
      // Prize pool = 2 players * entry fee - small platform fee (10%)
      const prizePool = (2 * fee) * 0.9;
      setFormData(prev => ({
        ...prev,
        prizeAmount: Math.round(prizePool)
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a challenge title",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.game) {
      toast({
        title: "Validation Error", 
        description: "Please select a game",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.challengeType) {
      toast({
        title: "Validation Error",
        description: "Please select a challenge type",
        variant: "destructive",
      });
      return false;
    }

    if (formData.entryFee <= 0) {
      toast({
        title: "Validation Error",
        description: "Entry fee must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.startDate || !formData.startTime) {
      toast({
        title: "Validation Error",
        description: "Please select start date and time",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.endDate || !formData.endTime) {
      toast({
        title: "Validation Error", 
        description: "Please select end date and time",
        variant: "destructive",
      });
      return false;
    }

    // Simple validation using local time
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    const now = new Date();

    if (startDateTime <= now) {
      toast({
        title: "Validation Error",
        description: "Start time must be in the future",
        variant: "destructive",
      });
      return false;
    }

    if (endDateTime <= startDateTime) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateChallenge = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a challenge",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call edge function to create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-custom-contest-payment',
        {
          body: {
            amount: formData.entryFee,
            challengeData: formData
          }
        }
      );

      if (orderError) {
        throw new Error(orderError.message);
      }

      // Persist order and form data for post-redirect verification
      try {
        localStorage.setItem('cf_cashfree_order_id', orderData.cashfree_order_id);
        localStorage.setItem('cf_custom_challenge_data', JSON.stringify(formData));
      } catch (_) {}

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

      // Initialize Cashfree Checkout
      const cashfree = (window as any).Cashfree({
        mode: "sandbox" // Change to "production" for live
      });

      // Store payment data for post-redirect verification
      try {
        localStorage.setItem('cf_custom_order_id', orderData.cashfree_order_id);
        localStorage.setItem('cf_custom_challenge_data', JSON.stringify(formData));
      } catch (e) {
        console.warn('Could not store payment data in localStorage:', e);
      }

      // Open Cashfree checkout
      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_self"
      };

      cashfree.checkout(checkoutOptions).then(async function(result: any) {
        if (result.error) {
          console.error('Cashfree error:', result.error);
          toast({
            title: "Payment Failed",
            description: result.error.message || "Payment failed. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (result.paymentDetails) {
          try {
            // Verify payment and create contest
            const { error: verifyError } = await supabase.functions.invoke(
              'verify-custom-contest-payment',
              {
                body: {
                  cashfree_order_id: orderData.cashfree_order_id,
                  challengeData: formData
                }
              }
            );

            if (verifyError) {
              throw new Error(verifyError.message);
            }

            toast({
              title: "Challenge Created! 🎉",
              description: "Your custom challenge has been created and is now live!",
            });

            // Reset form and close modal
            setFormData({
              title: "",
              description: "",
              game: "",
              challengeType: "",
              entryFee: 0,
              prizeAmount: 0,
              startDate: "",
              startTime: "",
              endDate: "",
              endTime: ""
            });
            setIsOpen(false);

          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Error",
              description: error.message || "Failed to verify payment. Please contact support.",
              variant: "destructive",
            });
          }
        }
      }).catch(function(error: any) {
        console.error('Cashfree checkout error:', error);
        toast({
          title: "Payment Failed",
          description: "Failed to open payment gateway. Please try again.",
          variant: "destructive",
        });
      }).finally(() => {
        setIsLoading(false);
      });

    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-gaming font-black text-white mb-4">
          Create Your <span className="text-gaming-orange">Custom Challenge</span>
        </h2>
        <p className="text-lg text-white/70">
          Host your own gaming challenges and compete with other players!
        </p>
      </div>

      {!isOpen ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                onClick={() => setIsOpen(true)}>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gaming-purple to-gaming-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-gaming font-bold text-white mb-2">
                Create Challenge
              </h3>
              <p className="text-white/70">
                Click to create your custom gaming challenge
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-gaming-orange" />
                Create Your Custom Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Challenge Name *</Label>
                    <Input
                      id="title"
                      placeholder="Enter challenge name"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your challenge..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Game Type *</Label>
                    <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select game" />
                      </SelectTrigger>
                      <SelectContent>
                        {gameOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Challenge Type *</Label>
                    <Select value={formData.challengeType} onValueChange={(value) => handleInputChange('challengeType', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select challenge type" />
                      </SelectTrigger>
                      <SelectContent>
                        {challengeTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <Label htmlFor="entryFee" className="text-white">Entry Fee (₹) *</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      placeholder="0"
                      value={formData.entryFee || ''}
                      onChange={(e) => handleInputChange('entryFee', Number(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prizeAmount" className="text-white">Prize Pool (₹)</Label>
                    <Input
                      id="prizeAmount"
                      type="number"
                      value={formData.prizeAmount || ''}
                      readOnly
                      className="bg-white/5 border-white/10 text-white/70 cursor-not-allowed"
                    />
                    <p className="text-xs text-white/50 mt-1">Auto-calculated: 90% of total entry fees</p>
                  </div>

                  {/* Timing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="startDate" className="text-white">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime" className="text-white">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="endDate" className="text-white">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-white">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-gaming font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Challenge Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-white/70">Max Participants</p>
                    <p className="text-gaming-cyan font-bold">2 Players</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70">Entry Fee Each</p>
                    <p className="text-gaming-green font-bold">₹{formData.entryFee}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70">Winner Gets</p>
                    <p className="text-gaming-orange font-bold">₹{formData.prizeAmount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateChallenge}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-gaming-purple to-gaming-orange hover:from-gaming-purple/80 hover:to-gaming-orange/80 text-white font-gaming font-bold"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pay ₹{formData.entryFee} & Create
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
};

export default CreateCustomChallengeSection;