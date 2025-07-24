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
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UserDashboardModal from "./UserDashboardModal";
import UploadResultsSection from "./UploadResultsSection";
import LiveChallengesSection from "./LiveChallengesSection";

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gaming-purple to-gaming-blue rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-gaming font-bold text-white">
                  Welcome, {userProfile.name}!
                </h1>
                <p className="text-gaming-cyan">{userProfile.skill_level} Player</p>
              </div>
            </div>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Games Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-gaming font-bold text-gaming-orange">
                  {userProfile.games_played || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Total Winnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-gaming font-bold text-gaming-purple">
                  ₹{userProfile.total_winnings?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Favorite Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-gaming font-bold text-gaming-blue">
                  {userProfile.favorite_game || 'BGMI'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userProfile.achievements && userProfile.achievements.length > 0 ? (
                    userProfile.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-gaming-cyan/20 text-gaming-cyan">
                        {achievement}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-white/70">No achievements yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => setShowUserModal(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Browse Contests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Challenges Section */}
          <LiveChallengesSection />

          {/* Upload Results Section */}
          <UploadResultsSection />

          {/* Recent Activity */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-white/70">No recent activity</p>
                <p className="text-white/50 text-sm mt-2">
                  Join a contest to see your activity here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showUserModal && <UserDashboardModal onClose={() => setShowUserModal(false)} />}
    </div>
  );
};

export default Dashboard;