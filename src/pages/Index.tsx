import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import GamingBackground from "@/components/3d/GamingBackground";

import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ChallengesSection from "@/components/home/ChallengesSection";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyTrustUsSection from "@/components/home/WhyTrustUsSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="pt-20">
        <HeroSection />
        
        {/* Gaming background starts after hero section */}
        <div className="relative">
          <GamingBackground />
          <div className="relative z-10">
            <FeaturesSection />
            <ChallengesSection />
            <HowItWorksSection />
            <LeaderboardSection />
            <TestimonialsSection />
            <WhyTrustUsSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
