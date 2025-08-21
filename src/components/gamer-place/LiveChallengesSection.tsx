import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ContestDetailsModal } from "@/components/ui/contest-details-modal";
import { ContestJoinModal } from "@/components/ui/contest-join-modal";
import { ContestShareButton } from "@/components/ui/contest-share-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LiveChallengesSection = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [userJoinedContests, setUserJoinedContests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("gamizn");
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchContests();
    if (userProfile) {
      setCurrentUserProfile(userProfile);
    }
    if (user) {
      fetchUserJoinedContests();
    }

    // Check if contest ID is in URL parameters to auto-open modal
    const urlParams = new URLSearchParams(window.location.search);
    const contestId = urlParams.get('contest');
    if (contestId) {
      handleSharedContest(contestId);
    }

    // Handle post-redirect verification for contest joining
    const paymentParam = urlParams.get('payment');
    if (paymentParam === 'success') {
      const joinOrderId = localStorage.getItem('cf_join_order_id');
      const joinCtxRaw = localStorage.getItem('cf_join_ctx');
      if (joinOrderId && joinCtxRaw) {
        const joinCtx = JSON.parse(joinCtxRaw);
        supabase.functions
          .invoke('verify-payment', {
            body: {
              cashfree_order_id: joinOrderId,
              contestId: joinCtx.contestId,
              gameId: joinCtx.gameId,
            },
          })
          .then(({ error }) => {
            if (error) {
              console.error('Join post-redirect verification error:', error);
              toast({
                title: 'Payment Verification Failed',
                description: error.message || 'Could not confirm your payment. Please contact support.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: '🎉 Contest Joined Successfully!',
                description: 'Payment confirmed and you have joined the contest.',
              });
              if (user) fetchUserJoinedContests();
            }
          })
          .finally(() => {
            try {
              localStorage.removeItem('cf_join_order_id');
              localStorage.removeItem('cf_join_ctx');
            } catch (_) {}
            const url = new URL(window.location.href);
            url.searchParams.delete('payment');
            window.history.replaceState({}, '', url.toString());
          });
      }
    }


    // Set up real-time subscription for contest changes
    const channel = supabase
      .channel('gamer-place-contest-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contests'
        },
        (payload) => {
          console.log('🎮 Gamer Place - Contest change detected:', payload);
          console.log('🔄 Gamer Place - Refreshing contests...');
          fetchContests(); // Refetch contests when any change occurs
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contest_participants'
        },
        (payload) => {
          console.log('🎮 Gamer Place - Contest participant change detected:', payload);
          console.log('🔄 Gamer Place - Refreshing user joined contests...');
          if (user) {
            fetchUserJoinedContests(); // Refetch user joined contests when participants change
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile, user]);

  const fetchUserJoinedContests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contest_participants')
        .select('contest_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user joined contests:', error);
        return;
      }

      const joinedContestIds = data?.map(item => item.contest_id) || [];
      setUserJoinedContests(joinedContestIds);
    } catch (error) {
      console.error('Error fetching user joined contests:', error);
    }
  };

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
    // Ensure we're working with proper dates without timezone conversion issues
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Debug log to check the actual dates
    console.log('Time calculation:', { now: now.toISOString(), start: start.toISOString(), startInput: startDate });
    
    if (now < start) {
      const diff = start.getTime() - now.getTime();
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours === 0) {
        return `${minutes}m`;
      }
      return `${hours}h ${minutes}m`;
    } else if (now >= start && now < end) {
      const diff = end.getTime() - now.getTime();
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours === 0) {
        return `${minutes}m`;
      }
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

  const handleSharedContest = async (contestId: string) => {
    try {
      const contest = contests.find(c => c.id === contestId);
      if (contest) {
        setSelectedContest(contest);
        setIsModalOpen(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // Fetch the specific contest if not in current list
        const { data, error } = await supabase
          .from('contests')
          .select(`
            *,
            image_updated_at,
            contest_participants!fk_contest_participants_contest_id(count)
          `)
          .eq('id', contestId)
          .single();

        if (data && !error) {
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
        }
      }
    } catch (error) {
      console.error('Error fetching shared contest:', error);
    }
  };

  const handleJoinContest = (contest: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join contests.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUserProfile) {
      toast({
        title: "Profile incomplete",
        description: "Please complete your profile first.",
        variant: "destructive",
      });
      return;
    }

    setSelectedContest(contest);
    setShowJoinModal(true);
  };

  const renderContestCard = (contest: any, index: number) => {
    const participantCount = contest.contest_participants?.[0]?.count || 0;
    const status = getContestStatus(contest.start_date, contest.end_date);
    const timeLeft = getTimeLeft(contest.start_date, contest.end_date);
    const isUserJoined = userJoinedContests.includes(contest.id);
    
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
          
          {/* Challenge Header - Only show image for admin created contests */}
          {!contest.created_by ? (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={contest.image_url ? (contest.image_url.startsWith('data:') ? contest.image_url : `${contest.image_url}?v=${new Date(contest.image_updated_at || contest.created_at).getTime()}`) : '/placeholder.svg'}
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
          ) : (
            <div className="relative h-16 bg-gradient-to-r from-gaming-purple/20 to-gaming-blue/20 border-b border-white/10">
              <div className="absolute top-4 left-4 z-10">
                <Badge 
                  variant={status === "ACTIVE" ? "default" : "secondary"}
                  className={`${status === "ACTIVE" ? "bg-gaming-green" : status === "UPCOMING" ? "bg-gaming-purple" : "bg-gray-500"} text-white border-0 backdrop-blur-sm bg-opacity-90`}
                >
                  {status}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <Trophy className="w-4 h-4 text-gaming-orange" />
                </div>
              </div>
            </div>
          )}

          {/* Challenge Content */}
          <div className="p-6 relative z-10">
            <h3 className="text-xl font-gaming font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
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
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300" 
                  size="sm"
                  onClick={() => {
                    setSelectedContest(contest);
                    setIsModalOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <ContestShareButton 
                  contest={contest}
                  variant="outline"
                />
              </div>
              {status === "ACTIVE" || status === "UPCOMING" ? (
                isUserJoined ? (
                  <Button 
                    variant="outline" 
                    className="w-full bg-gaming-green/20 border-gaming-green text-gaming-green cursor-default"
                    disabled
                  >
                    Already Joined ✓
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/80 hover:to-gaming-blue/80 transition-all duration-300"
                    onClick={() => handleJoinContest(contest)}
                    disabled={participantCount >= contest.max_participants}
                  >
                    {participantCount >= contest.max_participants ? "Contest Full" : "Join Contest"}
                  </Button>
                )
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full opacity-50 cursor-not-allowed"
                  disabled
                >
                  Contest Ended
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="text-center">
          <div className="animate-pulse">Loading contests...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-gaming font-black text-foreground mb-4">
          Live <span className="text-gaming-purple">Challenges</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Join live tournaments and win exciting prizes!
        </p>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      <ContestDetailsModal
        contest={selectedContest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoinContest={handleJoinContest}
        showJoinButton={true}
        isUserJoined={userJoinedContests.includes(selectedContest?.id || '')}
      />

      {selectedContest && currentUserProfile && (
        <ContestJoinModal
          contest={selectedContest}
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          userProfile={currentUserProfile}
          onJoinSuccess={fetchUserJoinedContests}
        />
      )}
    </section>
  );
};

export default LiveChallengesSection;