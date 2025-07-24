import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gamepad2, Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10 animate-pulse" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-transparent to-gaming-blue/20 z-10" />

      {/* Floating Circles */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-4 h-4 bg-gaming-purple rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-gaming-cyan rounded-full opacity-40 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gaming-green rounded-full opacity-80 animate-pulse delay-500" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-gaming-orange rounded-full opacity-50 animate-pulse delay-1500" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        {/* Hero Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <img
            src="/lovable-uploads/1.png"
            alt="Hero Icon"
            className="w-[150px] h-[150px] object-contain hover:scale-105"
          />

        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent leading-tight"
        >
          We don’t gamble. We GamiUp.
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold mb-8 text-foreground"
        >
          No Luck, No Lies —  <span className="text-gaming-purple">Just Game!</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          🎮 Play BGMI & Free Fire in skill-only custom challenges. You earn what you win.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/gamer-place")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-lg px-8 py-6 font-gaming font-bold group border-0"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Start Gaming
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-cyan-400 text-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-black transition-all duration-300 text-lg px-8 py-6 font-gaming font-bold group backdrop-blur-sm"
          >
            <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            View Challenges
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16"
        >
          <p className="text-muted-foreground mb-6">Trusted by thousands of gamers</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gaming-green rounded-full" />
              <span className="text-muted-foreground">✓ Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gaming-blue rounded-full" />
              <span className="text-muted-foreground">✓ Fair Play</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gaming-purple rounded-full" />
              <span className="text-muted-foreground">✓ Instant Payouts</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;