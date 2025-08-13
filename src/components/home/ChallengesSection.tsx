import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContestDetailsModal } from "@/components/ui/contest-details-modal";
import { ContestShareButton } from "@/components/ui/contest-share-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChallengesSection = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gamizn");

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

  // Separate useEffect for handling shared contest after contests are loaded
  useEffect(() => {
    if (contests.length > 0) {
      // Check if contest ID is in URL parameters to auto-open modal
      const urlParams = new URLSearchParams(window.location.search);
      const contestId = urlParams.get('contest');
      if (contestId) {
        console.log('🔗 Checking for shared contest:', contestId);
        handleSharedContest(contestId);
      }
    }
  }, [contests]);

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

      // Fetch creator info and challenge type for custom contests
      const contestsWithCreatorInfo = await Promise.all(
        (data || []).map(async (contest) => {
          if (contest.created_by) {
            const { data: creatorProfile } = await supabase
              .from('profiles')
              .select('name, whatsapp_number')
              .eq('user_id', contest.created_by)
              .single();
            
            // Get challenge type from creator's participant record
            const { data: participantData } = await supabase
              .from('contest_participants')
              .select('game_id')
              .eq('contest_id', contest.id)
              .eq('user_id', contest.created_by)
              .single();
            
            return {
              ...contest,
              creator_profile: creatorProfile,
              challenge_type: participantData?.game_id || 'Custom'
            } as any;
          }
          return contest;
        })
      );

      setContests(contestsWithCreatorInfo);
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

  const handleSharedContest = async (contestId: string) => {
    try {
      console.log('🔍 Looking for contest ID:', contestId, 'in loaded contests:', contests.length);
      
      const contest = contests.find(c => c.id === contestId);
      if (contest) {
        console.log('✅ Found contest in loaded list:', contest.title);
        setSelectedContest(contest);
        setIsModalOpen(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        console.log('🔄 Contest not in loaded list, fetching from database...');
        // Fetch the specific contest if not in current list
        const { data, error } = await supabase
          .from('contests')
          .select(`
            *,
            image_updated_at,
            contest_participants!fk_contest_participants_contest_id(count)
          `)
          .eq('id', contestId)
          .neq('status', 'deleted')
          .single();

        console.log('📡 Database fetch result:', { data, error });

        if (data && !error) {
          console.log('✅ Found contest in database:', data.title);
          let contestWithCreator = data;
          
          // Fetch creator info and challenge type if it's a custom contest
          if (data.created_by) {
            const { data: creatorProfile } = await supabase
              .from('profiles')
              .select('name, whatsapp_number')
              .eq('user_id', data.created_by)
              .single();
            
            // Get challenge type from creator's participant record
            const { data: participantData } = await supabase
              .from('contest_participants')
              .select('game_id')
              .eq('contest_id', data.id)
              .eq('user_id', data.created_by)
              .single();
            
            contestWithCreator = {
              ...data,
              creator_profile: creatorProfile,
              challenge_type: participantData?.game_id || 'Custom'
            } as any;
          }
          
          setSelectedContest(contestWithCreator);
          setIsModalOpen(true);
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        } else {
          console.error('❌ Contest not found:', error);
        }
      }
    } catch (error) {
      console.error('💥 Error fetching shared contest:', error);
    }
  };

  const handleJoinFromHome = (contest: any) => {
    // Redirect to gamer place with contest ID in URL for auto-opening
    navigate(`/gamer-place?contest=${contest.id}`);
  };

  const renderContestCard = (contest: any, index: number) => {
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-gaming-purple/20 group-hover:backdrop-blur-xl relative">
          {/* Glossy overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          
          {/* Challenge Header */}
          {!contest.created_by ? (
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img 
                src={contest.image_url ? (contest.image_url.startsWith('data:') ? contest.image_url : `${contest.image_url}?v=${new Date(contest.image_updated_at || contest.created_at).getTime()}`) : '/placeholder.svg'}
                alt={contest.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <Badge 
                  variant={status === "ACTIVE" ? "default" : "secondary"}
                  className={`${status === "ACTIVE" ? "bg-gaming-green" : status === "UPCOMING" ? "bg-gaming-purple" : "bg-gray-500"} text-white border-0 backdrop-blur-sm bg-opacity-90 text-xs sm:text-sm`}
                >
                  {status}
                </Badge>
              </div>
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-gaming-orange" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-12 sm:h-16 bg-gradient-to-r from-gaming-purple/20 to-gaming-blue/20 border-b border-white/10">
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <Badge 
                  variant={status === "ACTIVE" ? "default" : "secondary"}
                  className={`${status === "ACTIVE" ? "bg-gaming-green" : status === "UPCOMING" ? "bg-gaming-purple" : "bg-gray-500"} text-white border-0 backdrop-blur-sm bg-opacity-90 text-xs sm:text-sm`}
                >
                  {status}
                </Badge>
              </div>
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-gaming-orange" />
                </div>
              </div>
            </div>
          )}

          {/* Challenge Content */}
          <div className="p-3 sm:p-4 lg:p-6 relative z-10">
            <h3 className="text-lg sm:text-xl font-gaming font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
              {contest.title}
            </h3>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-white/70 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gaming-blue rounded-full" />
                {contest.game}
              </span>
              {contest.created_by && contest.creator_profile && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gaming-orange rounded-full" />
                  By {contest.creator_profile.name}
                </span>
              )}
              {contest.created_by && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gaming-green rounded-full" />
                  {contest.challenge_type || 'Custom'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/20">
                <p className="text-xs sm:text-sm text-white/70 mb-1">Prize Pool</p>
                <p className="text-sm sm:text-lg font-gaming font-bold text-gaming-green">
                  ₹{Number(contest.prize_pool).toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/20">
                <p className="text-xs sm:text-sm text-white/70 mb-1">Entry Fee</p>
                <p className="text-sm sm:text-lg font-gaming font-bold text-gaming-blue">
                  ₹{Number(contest.entry_fee).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-white/70">Participants</span>
                <span className="font-bold text-white">{participantCount}/{contest.max_participants}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-gaming-purple to-gaming-blue h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(participantCount / contest.max_participants) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{status === "ACTIVE" ? "Ends in" : status === "UPCOMING" ? "Starts in" : "Contest ended"}</span>
                <span className="text-gaming-orange font-bold">{timeLeft}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-xs sm:text-sm p-2 sm:px-3 sm:py-2" 
                  onClick={() => {
                    setSelectedContest(contest);
                    setIsModalOpen(true);
                  }}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Button>
                <ContestShareButton 
                  contest={contest}
                  variant="outline"
                  className="text-xs sm:text-sm p-2 sm:px-3 sm:py-2"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/80 hover:to-gaming-blue/80 transition-all duration-300 text-xs sm:text-sm p-2 sm:px-3 sm:py-2"
                onClick={() => handleJoinFromHome(contest)}
                disabled={status === "ENDED" || participantCount >= contest.max_participants}
              >
                {status === "ENDED" ? "Contest Ended" : 
                 participantCount >= contest.max_participants ? "Contest Full" : 
                 "Join Contest"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-8 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-2 shadow-2xl shadow-purple-500/20">
            <TabsTrigger 
              value="gamizn" 
              className="relative overflow-hidden rounded-xl px-6 py-3 font-gaming font-bold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gaming-purple data-[state=active]:to-gaming-blue data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-gaming-purple/50 text-white/60 hover:text-white/80 hover:bg-white/5 data-[state=active]:scale-105"
            >
              <span className="relative z-10">🏆 GAMIZN CONTESTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple/20 to-gaming-blue/20 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300" />
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="relative overflow-hidden rounded-xl px-6 py-3 font-gaming font-bold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gaming-orange data-[state=active]:to-gaming-cyan data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-gaming-orange/50 text-white/60 hover:text-white/80 hover:bg-white/5 data-[state=active]:scale-105"
            >
              <span className="relative z-10">⚔️ CUSTOM CHALLENGES</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-orange/20 to-gaming-cyan/20 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gamizn" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 px-2 sm:px-0">
              {contests.filter(contest => !contest.created_by).length === 0 ? (
                <div className="col-span-full text-center text-white/70">
                  No admin contests available at the moment. Check back soon!
                </div>
              ) : (
                contests.filter(contest => !contest.created_by).map((contest, index) => renderContestCard(contest, index))
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 px-2 sm:px-0">
              {contests.filter(contest => contest.created_by).length === 0 ? (
                <div className="col-span-full text-center text-white/70">
                  No custom challenges available at the moment. Check back soon!
                </div>
              ) : (
                contests.filter(contest => contest.created_by).map((contest, index) => renderContestCard(contest, index))
              )}
            </div>
          </TabsContent>
        </Tabs>

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
          onJoinContest={handleJoinFromHome}
          showJoinButton={true}
        />
      </div>
    </section>
  );
};

export default ChallengesSection;