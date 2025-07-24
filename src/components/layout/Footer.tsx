import { motion } from "framer-motion";
import { Trophy, Mail, Phone, MapPin, Zap } from "lucide-react";
import { FaReddit, FaTwitch, FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gaming-purple to-gaming-blue rounded-xl flex items-center justify-center shadow-lg shadow-gaming-purple/25">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-gaming font-black bg-gradient-to-r from-gaming-cyan to-gaming-blue bg-clip-text text-transparent">
                GameArena
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The ultimate esports challenge platform. Compete, win, and dominate in your favorite mobile games.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h3 className="font-gaming font-bold text-foreground text-lg">Platform</h3>
            <ul className="space-y-3">
              <li><a href="/#how-it-works" className="text-muted-foreground hover:text-gaming-cyan transition-colors">How it Works</a></li>
              <li><a href="/#challenges" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Games</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Pricing</a></li>
              <li><a href="/#leaderboard" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-gaming font-bold text-foreground text-lg">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Fair Play</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Verification</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-gaming font-bold text-foreground text-lg">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-gaming-cyan" />
                <span>vishwajeeet0994@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-gaming-cyan" />
                <span>+91 97176 78419</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-gaming-cyan" />
                <span>Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © 2025 GameUp. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Refund Policy</a>
            <a href="#" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Community Guidelines</a>
          </div>
        </div>

       {/* Social Icons */}
<div className="w-full flex justify-center mt-1 gap-8">
  {/* Reddit */}
  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center text-white hover:text-red-500 transition-transform transform hover:scale-110 hover:drop-shadow-glow"
  >
    <FaReddit className="text-4xl" />
    <span className="mt-1 text-sm font-medium">Reddit</span>
  </a>

  {/* Discord */}
  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center text-white hover:text-indigo-400 transition-transform transform hover:scale-110 hover:drop-shadow-glow"
  >
    <FaDiscord className="text-4xl" />
    <span className="mt-1 text-sm font-medium">Discord</span>
  </a>

  {/* Twitch */}
  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center text-white hover:text-purple-500 transition-transform transform hover:scale-110 hover:drop-shadow-glow"
  >
    <FaTwitch className="text-4xl" />
    <span className="mt-1 text-sm font-medium">Twitch</span>
  </a>
</div>



      </div>
    </footer>
  );
};

export default Footer;