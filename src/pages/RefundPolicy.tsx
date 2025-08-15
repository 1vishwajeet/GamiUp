import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const RefundPolicy = () => {
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
                            Refund Policy
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            This Refund & Cancellation Policy outlines the terms under which GamiZN, operating the platform, processes refunds and cancellations for payments made through our platform.
                            All policies are in accordance with Indian laws and payment gateway compliance requirements.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">1. General Refund Policy</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                All challenge entry fees are generally non-refundable once payment has been processed and the challenge
                                has begun. But in Any Condition of Payment failure - Fee amount will be refund. This policy ensures fair competition and platform sustainability.
                            </p>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">2. Exceptional Circumstances</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Refunds may be considered in the following exceptional circumstances:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Technical issues preventing participation due to platform errors</li>
                                <li>Challenge cancellation by GamiZN</li>
                                <li>Duplicate payment processing errors</li>
                                <li>Unauthorized transactions (subject to investigation)</li>
                            </ul>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">3. Refund Process</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                To request a refund under exceptional circumstances:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Contact our support team within 24 hours of the issue</li>
                                <li>Provide detailed information about the problem</li>
                                <li>Include transaction ID and relevant screenshots</li>
                                <li>Allow 3-5 business days for review and processing</li>
                            </ul>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">4. Prize Money Distribution</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Prize money is distributed based on verified results. If a result is disputed and found to be invalid,
                                prizes may be redistributed to the rightful winners.
                            </p>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">5. Payment Gateway Charges</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                In case of approved refunds, payment gateway charges may be deducted from the refund amount.
                                The actual refund amount may be less than the original payment due to processing fees.
                            </p>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">6. Contact for Refunds</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                For refund requests or questions about this policy, please contact our support team at vishwajeeet0994@gmail.com
                                or through our in-app support system.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RefundPolicy;