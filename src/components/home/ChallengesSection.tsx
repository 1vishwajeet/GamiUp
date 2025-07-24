import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContestDetailsModal } from "@/components/ui/contest-details-modal";

const ChallengesSection = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContests();
    
    // Set up real-time subscription for contest changes
    const channel = supabase
      .channel('contest-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contests'
        },
        (payload) => {
          console.log('🏠 Home - Contest change detected:', payload);
          console.log('🔄 Home - Refreshing contests...');
          fetchContests(); // Refetch contests when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchContests = async () => {
    try {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          image_updated_at,
          contest_participants!fk_contest_participants_contest_id(count)
        `)
        .neq('status', 'deleted') // Filter out deleted contests
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching contests:', error);
        return;
      }

      setContests(data || []);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

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
    // Parse dates as local time to avoid timezone issues
    const start = new Date(startDate.replace('Z', ''));
    const end = new Date(endDate.replace('Z', ''));
    
    if (now < start) return "UPCOMING";
    if (now >= start && now < end) return "ACTIVE";
    return "ENDED";
  };

  if (loading) {
    return (
      <section id="challenges" className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-20">
          <div className="text-center">
            <div className="animate-pulse">Loading contests...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="challenges" className="relative py-20 px-4 overflow-hidden">
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
      <div className="container mx-auto relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-black text-foreground mb-6">
            Live <span className="text-gaming-purple">Challenges</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            View ongoing tournaments and competitions. To participate, please visit{" "}
            <span className="text-gaming-purple font-semibold cursor-pointer" onClick={() => navigate("/gamer-place")}>
              Gamer Place
            </span>{" "}
            after logging in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {contests.length === 0 ? (
            <div className="col-span-full text-center text-white/70">
              No contests available at the moment. Check back soon!
            </div>
          ) : (
            contests.map((contest, index) => {
              const participantCount = contest.contest_participants?.[0]?.count || 0;
              const status = getContestStatus(contest.start_date, contest.end_date);
              const timeLeft = getTimeLeft(contest.start_date, contest.end_date);
              
              return (
              <motion.div
                key={contest.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-gaming-purple/20 group-hover:backdrop-blur-xl relative">
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Challenge Header with Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={contest.image_url ? (contest.image_url.startsWith('data:') ? contest.image_url : `${contest.image_url}?v=${new Date(contest.image_updated_at || contest.created_at).getTime()}`) : "/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(contest.game)}
                    alt={contest.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge 
                      variant={status === "ACTIVE" ? "default" : "secondary"}
                      className={`${status === "ACTIVE" ? "bg-gaming-green" : status === "UPCOMING" ? "bg-gaming-purple" : "bg-gray-500"} text-white border-0 backdrop-blur-sm bg-opacity-90`}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-6 h-6 text-gaming-orange" />
                    </div>
                  </div>
                </div>

                {/* Challenge Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-gaming font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                    {contest.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gaming-blue rounded-full" />
                      {contest.game}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-sm text-white/70 mb-1">Prize Pool</p>
                      <p className="text-lg font-gaming font-bold text-gaming-green">
                        ₹{Number(contest.prize_pool).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-sm text-white/70 mb-1">Entry Fee</p>
                      <p className="text-lg font-gaming font-bold text-gaming-blue">
                        ₹{Number(contest.entry_fee).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Participants</span>
                      <span className="font-bold text-white">{participantCount}/{contest.max_participants}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                      <div 
                        className="bg-gradient-to-r from-gaming-purple to-gaming-blue h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(participantCount / contest.max_participants) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock className="w-4 h-4" />
                      <span>{status === "ACTIVE" ? "Ends in" : status === "UPCOMING" ? "Starts in" : "Contest ended"}</span>
                      <span className="text-gaming-orange font-bold">{timeLeft}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300" 
                      size="sm"
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/80 hover:to-gaming-blue/80 hover:shadow-glow font-gaming font-bold text-white border-0 transition-all duration-300"
                      onClick={() => navigate("/gamer-place")}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Visit Gamer Place to join
                    </Button>
                  </div>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-green opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm" />
              </div>
              </motion.div>
            );
            })
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/gamer-place")}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 font-gaming font-bold"
          >
            Go to Gamer Place
          </Button>
        </motion.div>

        <ContestDetailsModal
          contest={selectedContest}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showJoinButton={false}
        />
      </div>
    </section>
  );
};

export default ChallengesSection;