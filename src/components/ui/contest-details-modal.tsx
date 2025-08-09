import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, Calendar, MapPin, Award, Target, X } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description: string;
  game: string;
  entry_fee: number;
  prize_pool: number;
  first_prize?: number;
  second_prize?: number;
  third_prize?: number;
  max_participants: number;
  start_date: string;
  end_date: string;
  image_url: string;
  status: string;
  contest_participants?: { count: number }[];
}

interface ContestDetailsModalProps {
  contest: Contest | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinContest?: (contest: Contest) => void;
  showJoinButton?: boolean;
  isUserJoined?: boolean;
}

export const ContestDetailsModal = ({ 
  contest, 
  isOpen, 
  onClose, 
  onJoinContest,
  showJoinButton = false,
  isUserJoined = false
}: ContestDetailsModalProps) => {
  if (!contest) return null;

  const getTimeLeft = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      const diff = start.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } else if (now >= start && now < end) {
      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return "Ended";
  };

  const getContestStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "UPCOMING";
    if (now >= start && now < end) return "ACTIVE";
    return "ENDED";
  };

  const participantCount = contest.contest_participants?.[0]?.count || 0;
  const status = getContestStatus(contest.start_date, contest.end_date);
  const timeLeft = getTimeLeft(contest.start_date, contest.end_date);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[85vh] sm:max-h-[90vh] my-4 sm:my-8 overflow-y-auto bg-background/95 backdrop-blur-xl border border-white/20 p-0">
        {/* Header with Close Button */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-gaming font-bold text-foreground">
              Contest Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Contest Image */}
          <div className="relative">
            <img 
              src={contest.image_url ? (contest.image_url.startsWith('data:') ? contest.image_url : `${contest.image_url}?t=${Date.now()}`) : "/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(contest.game)}
              alt={contest.title}
              className="w-full h-48 sm:h-64 object-cover rounded-xl"
            />
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <Badge 
                variant={status === "ACTIVE" ? "default" : "secondary"}
                className={`${status === "ACTIVE" ? "bg-gaming-green" : status === "UPCOMING" ? "bg-gaming-purple" : "bg-gray-500"} text-white border-0 text-xs sm:text-sm`}
              >
                {status}
              </Badge>
            </div>
          </div>

          {/* Contest Info */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-gaming font-bold text-foreground mb-2">
                {contest.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {contest.description || `Join this exciting ${contest.game} tournament and compete for amazing prizes!`}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-gaming-blue">{contest.game}</span>
            </div>

            {/* Prize and Entry Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gaming-green/10 rounded-xl p-3 sm:p-4 border border-gaming-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gaming-green" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Prize Pool</span>
                </div>
                <p className="text-lg sm:text-2xl font-gaming font-bold text-gaming-green">
                  ₹{Number(contest.prize_pool).toLocaleString()}
                </p>
              </div>
              <div className="bg-gaming-blue/10 rounded-xl p-3 sm:p-4 border border-gaming-blue/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gaming-blue" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Entry Fee</span>
                </div>
                <p className="text-lg sm:text-2xl font-gaming font-bold text-gaming-blue">
                  ₹{Number(contest.entry_fee).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Participants Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  Participants
                </span>
                <span className="font-bold text-foreground">{participantCount}/{contest.max_participants}</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-gaming-purple to-gaming-blue h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(participantCount / contest.max_participants) * 100}%` }}
                />
              </div>
            </div>

            {/* Timing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gaming-orange" />
                <span className="text-muted-foreground">
                  {status === "ACTIVE" ? "Ends in" : status === "UPCOMING" ? "Starts in" : "Contest ended"}
                </span>
                <span className="font-bold text-gaming-orange">{timeLeft}</span>
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Starts:</span>
                  <span className="text-foreground text-xs sm:text-sm">{formatDate(contest.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ends:</span>
                  <span className="text-foreground text-xs sm:text-sm">{formatDate(contest.end_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Distribution */}
        <div>
          <h4 className="text-base sm:text-lg font-gaming font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gaming-orange" />
            Prize Distribution
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-3 sm:p-4 border border-yellow-500/20">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">🥇</div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">1st Place</div>
                <div className="text-sm sm:text-lg font-gaming font-bold text-yellow-500">
                  ₹{contest.first_prize ? Number(contest.first_prize).toLocaleString() : Math.floor(Number(contest.prize_pool) * 0.5).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-400/10 to-gray-500/10 rounded-xl p-3 sm:p-4 border border-gray-400/20">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-400 mb-1">🥈</div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">2nd Place</div>
                <div className="text-sm sm:text-lg font-gaming font-bold text-gray-400">
                  ₹{contest.second_prize ? Number(contest.second_prize).toLocaleString() : Math.floor(Number(contest.prize_pool) * 0.3).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-600/10 to-amber-700/10 rounded-xl p-3 sm:p-4 border border-amber-600/20">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">🥉</div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">3rd Place</div>
                <div className="text-sm sm:text-lg font-gaming font-bold text-amber-600">
                  ₹{contest.third_prize ? Number(contest.third_prize).toLocaleString() : Math.floor(Number(contest.prize_pool) * 0.2).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showJoinButton && onJoinContest && (
          <div className="flex gap-3 sm:gap-4">
            {status === "ENDED" ? (
              <Button 
                disabled
                className="flex-1 bg-gray-500/20 border border-gray-500/50 text-gray-500 font-gaming font-bold cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Contest Ended
              </Button>
            ) : isUserJoined ? (
              <Button 
                disabled
                className="flex-1 bg-gaming-green/20 border border-gaming-green/50 text-gaming-green font-gaming font-bold cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Already Joined ✓
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/80 hover:to-gaming-blue/80 font-gaming font-bold text-sm sm:text-base py-2 sm:py-3"
                onClick={() => onJoinContest(contest)}
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Join Contest
              </Button>
            )}
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};