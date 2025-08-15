import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
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
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            This Privacy Policy explains how GamiZN, operating the platform, collects, uses, and protects the personal information of users in accordance with applicable laws of India, including the Information Technology Act, 2000 and related data protection regulations.
                            By using our website or services, you agree to the terms described in this Privacy Policy.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">1. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We collect information you provide directly to us, such as when you create an account, participate in challenges,
                                or contact us for support.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Personal information (name, email, phone number)</li>
                                <li>Gaming profile information and statistics</li>
                                <li>Payment and transaction information</li>
                                <li>Game screenshots and videos for verification</li>
                            </ul>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We use the information we collect to provide, maintain, and improve our services, process transactions,
                                and communicate with you.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>To operate and maintain the GamiZN platform</li>
                                <li>To process challenge entries and prize distributions</li>
                                <li>To verify game results and prevent fraud</li>
                                <li>To send you updates about new challenges and features</li>
                            </ul>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">3. Information Sharing</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                                except as described in this policy.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>With payment processors for transaction processing</li>
                                <li>With law enforcement when required by law</li>
                                <li>With service providers who assist in our operations</li>
                            </ul>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">4. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We implement appropriate security measures to protect your personal information against unauthorized access,
                                alteration, disclosure, or destruction.
                            </p>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">5. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                You have the right to access, update, or delete your personal information. You can also opt out of
                                certain communications from us.
                            </p>
                        </div>

                        <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-gaming font-bold mb-4 text-gaming-cyan">6. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at vishwajeeet0994@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;