import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to gamer place
  if (isAuthenticated) {
    navigate("/gamer-place");
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/7469.jpg')`
        }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Back to Website Button */}
      <div className="absolute top-6 left-6 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="bg-background/80 backdrop-blur-sm border-white/20 hover:bg-background/90 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Website
        </Button>
      </div>

      <div className="flex items-center justify-center px-4 py-20 relative z-20">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-gaming font-black bg-gradient-to-r from-gaming-cyan to-gaming-blue bg-clip-text text-transparent mb-4">
              Welcome to Gamer Place!
            </h1>
            <p className="text-muted-foreground text-lg">
              Please login or signup to access the GamiZn Gamer Place and participate in challenges.
            </p>
          </motion.div>

          <div className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-glow">
            {isLogin ? (
              <LoginForm
                onSuccess={() => navigate("/gamer-place")}
                onSwitchToSignup={() => setIsLogin(false)}
              />
            ) : (
              <SignupForm
                onSuccess={() => navigate("/gamer-place")}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>

          <p className="text-center text-lg text-muted-foreground mt-6">
            🔞 18+ Only – This battlefield is for adults. Underage accounts will be removed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;