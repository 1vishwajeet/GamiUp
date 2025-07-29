import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { Upload, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const UploadResultsSection = () => {
  const [rank, setRank] = useState("");
  const [kills, setKills] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit your results.",
          variant: "destructive",
        });
        return;
      }

      // Upload screenshot if provided
      let screenshotUrl = null;
      if (screenshot) {
        const fileName = `${user.id}_${Date.now()}_${screenshot.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contest-screenshots')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('contest-screenshots')
          .getPublicUrl(uploadData.path);

        screenshotUrl = urlData.publicUrl;
      }

      // First, get the user's most recent contest participation
      const { data: participantData, error: fetchError } = await supabase
        .from('contest_participants')
        .select('id')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !participantData) {
        throw new Error('No contest participation found. Please join a contest first.');
      }

      // Update the participant record with result
      const { error: updateError } = await supabase
        .from('contest_participants')
        .update({
          score: parseInt(kills),
          result_screenshot: screenshotUrl,
          additional_notes: notes.trim() || null,
          is_winner: true // Mark as potential winner for verification
        })
        .eq('id', participantData.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      toast({
        title: "Result Submitted!",
        description: "Your submission is under manual verification. Results will be announced soon.",
      });

      // Reset form
      setRank("");
      setKills("");
      setNotes("");
      setScreenshot(null);
      // Reset file input
      const fileInput = document.getElementById("screenshot") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error: any) {
      console.error('Error submitting result:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your result. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-cyan to-gaming-green bg-clip-text text-transparent">
            Upload Your Results
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Submit your game results with proof to claim your prizes. All submissions are manually verified.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Submit Result Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-card/20 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gaming-cyan/20 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gaming-cyan" />
                </div>
                <h3 className="text-2xl font-gaming font-bold text-foreground">
                  Submit Result
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rank">Your Rank</Label>
                    <Input
                      id="rank"
                      placeholder="Enter your rank"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kills">Total Kills</Label>
                    <Input
                      id="kills"
                      placeholder="Enter kill count"
                      value={kills}
                      onChange={(e) => setKills(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Proof Screenshot</Label>
                  <div className="border-2 border-dashed border-white/20 bg-card/10 backdrop-blur-sm rounded-xl p-8 text-center hover:border-gaming-cyan/50 transition-colors">
                    <input
                      type="file"
                      id="screenshot"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                    <label htmlFor="screenshot" className="cursor-pointer block">
                      <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {screenshot ? screenshot.name : "Click to upload your screenshot"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, JPEG (MAX. 5MB)
                      </p>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a clear screenshot showing your rank and kills
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about your game..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-accent hover:shadow-glow-green font-gaming font-bold text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting Result..."
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Result
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Prize Structure & Guidelines */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >

            {/* Guidelines */}
            <Card className="p-6 bg-card/20 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gaming-purple/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-gaming-purple" />
                </div>
                <h3 className="text-xl font-gaming font-bold text-foreground">
                  Guidelines
                </h3>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gaming-green rounded-full mt-2 flex-shrink-0" />
                  <p>Screenshot must clearly show your rank, kills, and match details</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gaming-blue rounded-full mt-2 flex-shrink-0" />
                  <p>All submissions are manually verified by our team</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gaming-purple rounded-full mt-2 flex-shrink-0" />
                  <p>Results must be submitted within 24 hours of match completion</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gaming-orange rounded-full mt-2 flex-shrink-0" />
                  <p>Prize money will be credited after verification</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadResultsSection;