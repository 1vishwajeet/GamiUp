import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalUsers: number;
  totalContests: number;
  activeContests: number;
  totalEntries: number;
  newUsersToday: number;
  contestsCreated: number;
  paymentsProcessed: number;
}

export interface ContestParticipant {
  id: string;
  userName: string;
  userId: string;
  bgmiUserId: string;
  contactNumber: string;
  contestName: string;
  contestType: string;
  transactionId: string;
  joinDateTime: string;
  paymentStatus: 'Success' | 'Pending' | 'Failed';
  entryFee: number;
}

export interface WinnerSubmission {
  id: string;
  userName: string;
  userId: string;
  contestName: string;
  rank: number;
  kills: number;
  screenshotProof: string | null;
  additionalNotes?: string;
  submissionDateTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  prizeAmount: number;
}

export const useAdminData = () => {
  const { toast } = useToast();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalContests: 0,
    activeContests: 0,
    totalEntries: 0,
    newUsersToday: 0,
    contestsCreated: 0,
    paymentsProcessed: 0,
  });
  const [contestParticipants, setContestParticipants] = useState<ContestParticipant[]>([]);
  const [winnerSubmissions, setWinnerSubmissions] = useState<WinnerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      console.log('📊 Fetching dashboard stats using admin function...');
      
      // Check if admin is authenticated
      const adminAuth = sessionStorage.getItem('adminAuth');
      const sessionActive = sessionStorage.getItem('admin-session-active');
      
      if (adminAuth !== 'true' || sessionActive !== 'true') {
        console.log('❌ Admin not authenticated for stats');
        return;
      }

      // Use admin function to get all stats in one call
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_admin_dashboard_stats');

      console.log('📊 Dashboard stats RPC result:', { data: statsData, error: statsError });

      if (statsError) {
        console.error('❌ Error fetching dashboard stats:', statsError);
        throw statsError;
      }

      if (statsData && statsData.length > 0) {
        const stats = statsData[0];
        setDashboardStats({
          totalUsers: Number(stats.total_users) || 0,
          totalContests: Number(stats.total_contests) || 0,
          activeContests: Number(stats.active_contests) || 0,
          totalEntries: Number(stats.total_entries) || 0,
          newUsersToday: Number(stats.new_users_today) || 0,
          contestsCreated: Number(stats.contests_created_today) || 0,
          paymentsProcessed: Number(stats.payments_processed_today) || 0,
        });
        
        console.log('✅ Dashboard stats updated:', {
          totalUsers: stats.total_users,
          totalContests: stats.total_contests,
          activeContests: stats.active_contests,
          totalEntries: stats.total_entries,
          newUsersToday: stats.new_users_today,
          contestsCreated: stats.contests_created_today,
          paymentsProcessed: stats.payments_processed_today,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
    }
  };

  const fetchContestParticipants = async () => {
    try {
      console.log('🔍 Fetching contest participants using admin functions...');
      
      // Check if admin is authenticated via AdminAuthContext
      const adminAuth = sessionStorage.getItem('adminAuth');
      const sessionActive = sessionStorage.getItem('admin-session-active');
      
      console.log('🔐 Admin session check:', { adminAuth, sessionActive });
      
      if (adminAuth !== 'true' || sessionActive !== 'true') {
        console.log('❌ Admin not authenticated via admin panel');
        setContestParticipants([]);
        return;
      }

      console.log('✅ Admin authenticated, fetching data using RPC...');

      // Use the admin function that bypasses RLS
      const { data: participantsData, error: participantsError } = await supabase
        .rpc('get_admin_contest_participants');

      console.log('📊 Admin contest participants RPC result:', { data: participantsData, error: participantsError });

      if (participantsError) {
        console.error('❌ Error fetching participants via RPC:', participantsError);
        throw participantsError;
      }

      if (!participantsData || participantsData.length === 0) {
        console.log('📊 No contest participants found via admin function');
        setContestParticipants([]);
        return;
      }

      console.log('📊 Found participants via RPC:', participantsData);

      // Get additional data using admin functions
      const userIds = [...new Set(participantsData.map(p => p.user_id))];
      const contestIds = [...new Set(participantsData.map(p => p.contest_id))];

      console.log('👥 Fetching profiles via RPC for users:', userIds);
      console.log('🏆 Fetching contests via RPC for ids:', contestIds);

      // Get profiles data
      const profilesResult = await supabase.rpc('get_admin_profiles', { user_ids: userIds });
      
      // For contests, we need to check both active contests and contests history
      // since deleted contests move to history table
      const [activeContestsResult, historyContestsResult] = await Promise.all([
        supabase.rpc('get_admin_contests', { contest_ids: contestIds }),
        supabase.from('contests_history').select('id, title, game, entry_fee').in('id', contestIds)
      ]);

      console.log('👥 Profiles RPC result:', profilesResult);
      console.log('🏆 Active contests RPC result:', activeContestsResult);
      console.log('📜 History contests result:', historyContestsResult);

      // Combine active and history contests
      const allContests = [
        ...(activeContestsResult.data || []),
        ...(historyContestsResult.data || [])
      ];

      // Map the data manually
      const participants: ContestParticipant[] = participantsData.map((participant: any) => {
        const profile = profilesResult.data?.find((p: any) => p.user_id === participant.user_id);
        const contest = allContests.find((c: any) => c.id === participant.contest_id);
        
        return {
          id: participant.id,
          userName: profile?.name || 'Unknown User',
          userId: participant.user_id.slice(0, 8).toUpperCase(),
          bgmiUserId: participant.game_id || 'N/A',
          contactNumber: profile?.whatsapp_number || 'N/A',
          contestName: contest?.title || 'Unknown Contest',
          contestType: contest?.game || 'Unknown Game',
          transactionId: participant.transaction_id || participant.payment_id || 'N/A',
          joinDateTime: participant.joined_at,
          paymentStatus: participant.payment_status === 'completed' ? 'Success' : 
                        participant.payment_status === 'pending' ? 'Pending' : 'Failed',
          entryFee: contest?.entry_fee || 0,
        };
      });

      console.log('✅ Final processed participants:', participants);
      setContestParticipants(participants);
    } catch (error) {
      console.error('❌ Error fetching contest participants:', error);
      setContestParticipants([]);
    }
  };

  const fetchWinnerSubmissions = async () => {
    try {
      console.log('🏆 Fetching winner submissions from new table...');
      console.log('🔍 Current URL:', window.location.href);
      
      // Check if admin is authenticated
      const adminAuth = sessionStorage.getItem('adminAuth');
      const sessionActive = sessionStorage.getItem('admin-session-active');
      
      console.log('🔐 Admin session check for winner submissions:', { adminAuth, sessionActive });
      
      if (adminAuth !== 'true' || sessionActive !== 'true') {
        console.log('❌ Admin not authenticated for winner submissions');
        setWinnerSubmissions([]);
        return;
      }

      // First fetch winner submissions
      const { data: winnersData, error: winnersError } = await supabase
        .from('winner_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (winnersError) {
        console.error('❌ Error fetching winner submissions:', winnersError);
        throw winnersError;
      }

      // Then fetch profiles for the users
      const userIds = winnersData?.map(submission => submission.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, whatsapp_number')
        .in('user_id', userIds);

      console.log('🏆 Winner submissions result:', { data: winnersData, error: winnersError });
      console.log('👥 Profiles data result:', { data: profilesData, error: profilesError });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
      }

      const submissions: WinnerSubmission[] = winnersData?.map((submission: any, index: number) => {
        const profile = profilesData?.find((p: any) => p.user_id === submission.user_id);
        return {
          id: submission.id,
          userName: profile?.name || 'Unknown User',
          userId: submission.user_id.slice(0, 8).toUpperCase(),
          contestName: submission.contest_name,
          rank: index + 1, // Simple ranking for now (keeping for backward compatibility)
          kills: 0, // Not needed anymore but keeping for backward compatibility
          screenshotProof: submission.result_screenshot,
          additionalNotes: submission.additional_notes || null,
          submissionDateTime: submission.submitted_at,
          status: submission.status === 'pending' ? 'Pending' : 'Approved',
          prizeAmount: submission.expected_prize_amount || 0,
        };
      }) || [];

      console.log('✅ Final processed winner submissions:', submissions);
      setWinnerSubmissions(submissions);
    } catch (error) {
      console.error('❌ Error fetching winner submissions:', error);
      setWinnerSubmissions([]);
    }
  };

  const updateWinnerStatus = async (id: string, status: 'Delete') => {
    try {
      console.log('🗑️ Attempting to delete submission with ID:', id);
      
      if (status === 'Delete') {
        // Check admin session using sessionStorage (since admin auth is separate)
        const adminAuth = sessionStorage.getItem('adminAuth');
        const sessionActive = sessionStorage.getItem('admin-session-active');
        
        console.log('🔐 Admin session check:', { adminAuth, sessionActive });
        
        if (adminAuth !== 'true' || sessionActive !== 'true') {
          console.error('❌ Admin not authenticated via session');
          toast({
            title: "Authentication Error",
            description: "Please login as admin",
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Admin session verified, proceeding with delete...');

        // Use admin function to delete bypassing RLS
        const { data, error } = await supabase
          .rpc('admin_delete_winner_submission', { submission_id: id });

        console.log('🔧 Delete operation result:', { data, error });

        if (error) {
          console.error('❌ Delete error:', error);
          toast({
            title: "Delete Failed",
            description: error.message || "Failed to delete submission",
            variant: "destructive",
          });
          return;
        }

        if (data && typeof data === 'object' && 'success' in data && !(data as any).success) {
          console.error('❌ Delete failed:', (data as any).message);
          toast({
            title: "Delete Failed",
            description: (data as any).message || "Failed to delete submission",
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Successfully deleted submission from database');
        
        toast({
          title: "Success",
          description: "Submission removed successfully",
        });
        
        // Remove from local state immediately
        setWinnerSubmissions(prev => {
          const updated = prev.filter(sub => sub.id !== id);
          console.log('🔄 Updated local state, remaining submissions:', updated.length);
          return updated;
        });

      }
    } catch (error) {
      console.error('❌ Error deleting winner submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🚀 Starting admin data fetch...');
      await Promise.all([
        fetchDashboardStats(),
        fetchContestParticipants(),
        fetchWinnerSubmissions()
      ]);
      setLoading(false);
      console.log('✅ Admin data fetch completed');
    };

    fetchData();

    // Set up real-time subscriptions for live updates
    const participantsChannel = supabase
      .channel('admin-contest-participants')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contest_participants'
        },
        (payload) => {
          console.log('🔄 Contest participants updated:', payload);
          
          // Handle DELETE events immediately without refetching
          if (payload.eventType === 'DELETE' && payload.old) {
            setWinnerSubmissions(prev => {
              const updated = prev.filter(sub => sub.id !== payload.old.id);
              console.log('🗑️ Real-time delete: Removed submission from local state');
              return updated;
            });
           } else {
             // For INSERT/UPDATE, refetch data
             fetchContestParticipants();
             // Don't refetch winner submissions here as they have their own listener
           }
          fetchDashboardStats();
        }
      )
      .subscribe();

    // Real-time listener for new winner_submissions table
    const winnerSubmissionsChannel = supabase
      .channel('admin-winner-submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'winner_submissions'
        },
        (payload) => {
          console.log('🔄 Winner submissions updated:', payload);
          
          // Handle DELETE events immediately without refetching
          if (payload.eventType === 'DELETE' && payload.old) {
            setWinnerSubmissions(prev => {
              const updated = prev.filter(sub => sub.id !== payload.old.id);
              console.log('🗑️ Real-time delete: Removed winner submission from local state');
              return updated;
            });
          } else {
            // For INSERT/UPDATE, refetch data
            fetchWinnerSubmissions();
          }
          fetchDashboardStats();
        }
      )
      .subscribe();

    const contestsChannel = supabase
      .channel('admin-contests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contests'
        },
        () => {
          console.log('🔄 Contests updated, refreshing data...');
          fetchDashboardStats();
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('admin-profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('🔄 Profiles updated, refreshing data...');
          fetchContestParticipants();
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(winnerSubmissionsChannel);
      supabase.removeChannel(contestsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  return {
    dashboardStats,
    contestParticipants,
    winnerSubmissions,
    loading,
    updateWinnerStatus,
    refetch: () => {
      fetchDashboardStats();
      fetchContestParticipants();
      fetchWinnerSubmissions();
    }
  };
};