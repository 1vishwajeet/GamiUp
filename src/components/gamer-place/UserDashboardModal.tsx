import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, Mail, Trophy, Target, Star, Gamepad2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserDashboardModalProps {
  onClose: () => void;
}

const UserDashboardModal = ({ onClose }: UserDashboardModalProps) => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl h-[90vh] mx-4 bg-background/95 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-gaming font-bold text-white">
              User Profile
            </h2>
            <p className="text-white/70">See your Gaming profile</p>
          </div>
          
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80">Name</Label>
                    <Input 
                      value={userProfile.name} 
                      readOnly 
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Username</Label>
                    <Input 
                      value={userProfile.username} 
                      readOnly 
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Email</Label>
                    <Input 
                      value={userProfile.email} 
                      readOnly 
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Contact Number</Label>
                    <Input 
                      value={userProfile.whatsapp_number} 
                      readOnly 
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-orange mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-white/70">Games Played</p>
                  <p className="text-lg sm:text-xl font-bold text-white">{userProfile.games_played || 0}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-purple mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-white/70">Total Winnings</p>
                  <p className="text-lg sm:text-xl font-bold text-gaming-green">₹{userProfile.total_winnings?.toLocaleString() || '0'}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-blue mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-white/70">Skill Level</p>
                  <p className="text-lg sm:text-xl font-bold text-gaming-cyan">{userProfile.skill_level || 'Beginner'}</p>
                </CardContent>
              </Card>
            </div>
            

            

          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboardModal;