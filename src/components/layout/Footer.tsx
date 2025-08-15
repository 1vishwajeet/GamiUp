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
    <footer className="relative py-10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer relative z-10"
            >
              <img
                src="/lovable-uploads/2.png"
                alt="GameUp Logo"
                className="h-10 sm:h-16 object-contain"
              />
            </motion.div>
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
              <li><a href="/#leaderboard" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Contact and Social Media */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact */}
            <div className="space-y-6">
              <h3 className="font-gaming font-bold text-foreground text-lg">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5 text-gaming-cyan" />
                  <a
                    href="mailto:vishwajeeet0994@gmail.com"
                    className="hover:underline"
                  >
                    vishwajeeet0994@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5 text-gaming-cyan" />
                  <a
                    href="tel:+919717678419"
                    className="hover:underline"
                  >
                    +91 97176 78419
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-gaming-cyan" />
                  <span>Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-6">
              <h3 className="font-gaming font-bold text-foreground text-lg">Our Social Media</h3>
              <div className="space-y-4">
                {/* Reddit */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <FaReddit className="text-3xl" />
                  <span className="font-medium">Reddit</span>
                </a>

                {/* Discord */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-indigo-400 transition-colors"
                >
                  <FaDiscord className="text-3xl" />
                  <span className="font-medium">Discord</span>
                </a>

                {/* Twitch */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-purple-500 transition-colors"
                >
                  <FaTwitch className="text-3xl" />
                  <span className="font-medium">Twitch</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © 2024 GamiZN. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/terms" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Terms of Service</a>
            <a href="/privacy" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Privacy Policy</a>
            <a href="/refund" className="text-muted-foreground hover:text-gaming-cyan transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;