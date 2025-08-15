import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Gamepad2, 
  Settings, 
  LogOut, 
  User,
  Star,
  Target,
  Calendar,
  Award,
  Flame
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UserDashboardModal from "./UserDashboardModal";
import UploadResultsSection from "./UploadResultsSection";
import LiveChallengesSection from "./LiveChallengesSection";
import CreateCustomChallengeSection from "./CreateCustomChallengeSection";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  const { userProfile, logout, loading } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "See you next time!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load user data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Rise. Grind. Win.",
      desc: "Every match is a step closer to greatness.",
      icon: <Flame size={40} />,
      color: " ",
    },
    {
      title: "Precision Beats Luck",
      desc: "Sharpen your aim, not just your skills.",
      icon: <Target size={40} />,
      color: "",
    },
    {
      title: "Legends Never Quit",
      desc: "Defeat is a lesson, not an end.",
      icon: <Trophy size={40} />,
      color: "",
    },
  ];


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/9489101.jpg')`
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/30 via-transparent to-gaming-blue/20" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
  {/* Left Section: Icon + Welcome Text */}
  <div className="flex items-center gap-3">
    
    <h1 className="text-[28px] sm:text-4xl font-gaming font-bold text-white flex items-center gap-2">
      Welcome, <span className="text-gaming-orange">{userProfile.name}</span>
    </h1>
  </div>

  {/* Right Section: Profile + Logout */}
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowUserModal(true)}
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      <Settings className="w-4 h-4 mr-2" />
      Profile
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  </div>
</div>



          {/* Motivational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 `}
              >
                <div className="flex items-center justify-center mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-center mb-2">{card.title}</h3>
                <p className="text-sm text-center">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Live Challenges Section */}
          <LiveChallengesSection />

          {/* Create Custom Challenge Section */}
          <CreateCustomChallengeSection />

          {/* Upload Results Section */}
          <UploadResultsSection />

          <div className="w-full bg-transparent py-10 px-6 mt-16 border-t border-gray-700 ">
            <div className="max-w-4xl mx-auto text-center space-y-6">

              <h2 className="text-5xl md:text-4xl font-extrabold text-yellow-500 tracking-wide">
                You’re not just here to PLAY
              </h2>

              <p className="text-gray-500 text-xl md:text-xl font-medium leading-relaxed">
                You’re here to conquer, to compete, to rise.
                Every challenge you take brings you one step closer to becoming a legend.
              </p>


              <p className="text-purple-500 italic text-lg mt-8">
                “Greatness isn’t given. It’s earned – one match at a time.”
              </p>

            </div>
          </div>






        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {showUserModal && <UserDashboardModal onClose={() => setShowUserModal(false)} />}
    </div>
  );
};


export default Dashboard;