import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-8 hover:bg-gaming-cyan/10 hover:text-gaming-cyan"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-cyan to-gaming-blue bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These Terms of Service (“Terms”) govern your use of GamiZN, a platform operated by Vishwajeet, registered in Delhi. By accessing or using our services, you agree to these Terms.
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using GamiZN, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">2. Gaming Challenges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GamiZN provides a platform for mobile gaming competitions. Users can participate in challenges, tournaments, 
                and contests by paying entry fees and competing for prize money. All gameplay must be fair and follow game-specific rules.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Users must be 18 years or older to participate in paid challenges</li>
                <li>All gameplay must be recorded and submitted as proof</li>
                <li>Cheating or unfair practices will result in immediate disqualification</li>
                <li>Prize distribution is subject to verification of results</li>
              </ul>
            </div>

            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users are responsible for maintaining the confidentiality of their account information and for all activities 
                that occur under their account. Users must provide accurate information and comply with all applicable laws.
              </p>
            </div>

            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">4. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All payments are processed securely through our payment partners. Entry fees are non-refundable once a challenge But in Any Condition of Payment failure - Fee amount will be refund. 
                For detailed information about refunds and cancellations, please refer to our Refund & Cancellation Policy. Prize money will be distributed within 1-3 business days after result verification.
              </p>
            </div>

            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GamiZN shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </div>

            <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">6. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at vishwajeeet0994@gmail.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;