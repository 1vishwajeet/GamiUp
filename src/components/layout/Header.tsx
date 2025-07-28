import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy, BarChart3, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Challenges", href: "/#challenges" },
    { name: "Leaderboard", href: "/#leaderboard" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-xl"
      >
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple/10 via-transparent to-gaming-blue/10 rounded-lg" />

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer relative z-10"
            onClick={() => navigate("/")}
          >
            <img
              src="/lovable-uploads/2.png"
              alt="GameUp Logo"
              className="h-10 sm:h-16 object-contain"
            />
          </motion.div>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 relative z-10">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-foreground/90 hover:text-gaming-cyan transition-all duration-300 font-medium text-lg relative group"
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gaming-cyan to-gaming-blue transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Right Side - Gamer Place Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 relative z-10">
            {/* Gamer Place Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-blue hover:to-gaming-purple transition-all duration-500 font-gaming font-bold text-xs sm:text-sm md:text-lg px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 shadow-lg shadow-gaming-purple/25 hover:shadow-gaming-blue/25"
              >
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Gamer Place</span>
                <span className="sm:hidden">Play</span>
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 text-foreground hover:text-gaming-cyan transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <span className="text-xl font-gaming font-black bg-gradient-to-r from-gaming-cyan to-gaming-blue bg-clip-text text-transparent">
              Menu
            </span>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 text-foreground hover:text-gaming-cyan transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left py-3 px-4 rounded-lg text-foreground/90 hover:text-gaming-cyan hover:bg-gaming-purple/10 transition-all duration-300 font-medium text-lg group"
                  >
                    {item.name}
                    <div className="w-0 h-0.5 bg-gradient-to-r from-gaming-cyan to-gaming-blue transition-all duration-300 group-hover:w-full mt-1" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-white/10">
            <p className="text-sm text-muted-foreground text-center">
              Ready to compete? Join the arena now!
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Header;