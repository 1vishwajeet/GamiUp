import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Users, Trophy, Calendar, DollarSign, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface CustomChallenge {
  id: string;
  title: string;
  description: string;
  game: string;
  entry_fee: number;
  first_prize: number;
  second_prize: number;
  third_prize: number;
  max_participants: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  created_by: string;
  creator_name: string;
  creator_contact: string;
  participant_count: number;
  payment_status: string;
  challenge_type?: string;
}

interface ChallengeParticipant {
  id: string;
  user_id: string;
  user_name: string;
  user_contact: string;
  payment_status: string;
  joined_at: string;
  score: number;
  is_winner: boolean;
  prize_amount: number;
  transaction_id: string;
}

const CustomChallengesList = () => {
  const [challenges, setChallenges] = useState<CustomChallenge[]>([]);
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomChallenges = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_custom_challenges');
      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching custom challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallengeParticipants = async (challengeId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_custom_challenge_participants', {
        challenge_id: challengeId
      });
      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error("Error fetching challenge participants:", error);
    }
  };

  // Function to get challenge type from participants data
  const getChallengeType = async (challengeId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('contest_participants')
        .select('game_id')
        .eq('contest_id', challengeId)
        .limit(1)
        .single();
      
      if (error || !data) return 'Custom';
      return data.game_id || 'Custom';
    } catch (error) {
      return 'Custom';
    }
  };

  useEffect(() => {
    fetchCustomChallenges();

    // Set up real-time subscriptions
    const contestsSubscription = supabase
      .channel('admin-custom-contests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contests' }, () => {
        fetchCustomChallenges();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_contest_payments' }, () => {
        fetchCustomChallenges();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contest_participants' }, () => {
        fetchCustomChallenges();
        if (selectedChallenge) {
          fetchChallengeParticipants(selectedChallenge);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(contestsSubscription);
    };
  }, [selectedChallenge]);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChallengeStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.creator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewParticipants = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    fetchChallengeParticipants(challengeId);
  };

  const handleDeleteChallenge = async (challengeId: string, challengeTitle: string) => {
    try {
      setDeletingId(challengeId);
      
      const { data, error } = await supabase.rpc('admin_delete_contest', {
        p_contest_id: challengeId
      });

      if (error) {
        throw error;
      }

      // Type the response data properly
      const response = data as { success: boolean; message: string };
      
      if (response?.success) {
        toast({
          title: "Challenge Deleted",
          description: `"${challengeTitle}" has been successfully deleted.`,
        });
        
        // Refresh the challenges list
        fetchCustomChallenges();
      } else {
        throw new Error(response?.message || 'Failed to delete challenge');
      }
    } catch (error: any) {
      console.error('Error deleting challenge:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (selectedChallenge) {
    const challenge = challenges.find(c => c.id === selectedChallenge);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Challenge Participants</h2>
            <p className="text-muted-foreground">
              {challenge?.title} - Participants List
            </p>
          </div>
          <Button 
            onClick={() => setSelectedChallenge(null)}
            variant="outline"
          >
            Back to Challenges
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Entry Fee Paid</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => {
                  const challenge = challenges.find(c => c.id === selectedChallenge);
                  return (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.user_name}</TableCell>
                      <TableCell>{participant.user_contact}</TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(participant.payment_status)}>
                          {participant.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(participant.joined_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>₹{challenge?.entry_fee || 0}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {participant.transaction_id || 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {participants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No participants found for this challenge.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Custom Challenges Info</h2>
          <p className="text-muted-foreground">
            View and manage user-created custom challenges
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Challenges</p>
                <p className="text-2xl font-bold text-foreground">{challenges.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Challenges</p>
                <p className="text-2xl font-bold text-foreground">
                  {challenges.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold text-foreground">
                  {challenges.reduce((sum, c) => sum + c.participant_count, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Prize Pool</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{challenges.reduce((sum, c) => sum + (c.first_prize + c.second_prize + c.third_prize), 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search challenges by name, creator, or game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Challenges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Challenges ({filteredChallenges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge Name</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Game Type</TableHead>
                  <TableHead>Challenge Type</TableHead>
                  <TableHead>Entry Fee</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => {
                  return (
                    <TableRow key={challenge.id}>
                      <TableCell className="font-medium">{challenge.title}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{challenge.creator_name}</div>
                          <div className="text-sm text-muted-foreground">{challenge.created_by}</div>
                        </div>
                      </TableCell>
                      <TableCell>{challenge.creator_contact || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{challenge.game}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {challenge.challenge_type || 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{challenge.entry_fee}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {challenge.participant_count}/{challenge.max_participants}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(challenge.start_date), 'MMM dd, HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(challenge.end_date), 'MMM dd, HH:mm')}
                        </div>
                      </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewParticipants(challenge.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        
                        {challenge.status === 'deleted' ? (
                          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            <Trash2 className="w-4 h-4" />
                            Challenge Deleted
                          </div>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingId === challenge.id}
                              >
                                <Trash2 className="w-4 h-4" />
                                {deletingId === challenge.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{challenge.title}"? This action cannot be undone.
                                  {challenge.participant_count > 0 && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                                      <strong>Warning:</strong> This challenge has {challenge.participant_count} participant(s). 
                                      The challenge will be moved to history and participant data will be preserved.
                                    </div>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteChallenge(challenge.id, challenge.title)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Challenge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!loading && filteredChallenges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No custom challenges found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomChallengesList;