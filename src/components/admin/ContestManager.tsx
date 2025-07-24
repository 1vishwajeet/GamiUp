import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Users, Trophy, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Contest = Tables<'contests'> & {
  participant_count?: number;
};

interface ContestManagerProps {
  // Remove props - we'll manage contests internally
}

const ContestManager = ({}: ContestManagerProps) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContest, setNewContest] = useState({
    title: "",
    game: "",
    description: "",
    prize_pool: "",
    first_prize: "",
    second_prize: "",
    third_prize: "",
    entry_fee: "",
    max_participants: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
    image_url: ""
  });

  // Load contests from Supabase
  useEffect(() => {
    loadContests();
    setupRealtimeSubscription();
  }, []);

  const loadContests = async () => {
    try {
      console.log('🏆 Loading contests using admin function...');
      
      // Check if admin is authenticated
      const adminAuth = sessionStorage.getItem('adminAuth');
      const sessionActive = sessionStorage.getItem('admin-session-active');
      
      if (adminAuth !== 'true' || sessionActive !== 'true') {
        console.log('❌ Admin not authenticated for contests');
        setContests([]);
        return;
      }

      // Use admin function to get contests data
      const { data, error } = await supabase.rpc('get_admin_contests_full');

      console.log('🏆 Contests RPC result:', { data, error });

      if (error) {
        console.error('❌ Error loading contests:', error);
        throw error;
      }

      // Filter out deleted contests for the UI
      const activeContests = (data || []).filter((contest: any) => contest.status !== 'deleted');
      
      setContests(activeContests.map((contest: any) => ({
        ...contest,
        updated_at: contest.created_at, // Set updated_at same as created_at if missing
        created_by: contest.created_by || null,
        participant_count: Number(contest.participant_count) || 0
      })));
      console.log('✅ Contests loaded successfully:', data?.length || 0);
    } catch (error) {
      console.error('Error loading contests:', error);
      toast({
        title: "Error",
        description: "Failed to load contests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('contests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contests'
        },
        () => {
          loadContests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewContest({...newContest, image_url: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const activeContests = contests.filter(c => c.status === "active").length;
  const totalContests = contests.length;

  const handleAddContest = async () => {
    try {
      // Convert datetime-local input to local time, then to UTC for storage
      const convertLocalToUTC = (dateTimeLocal: string) => {
        if (!dateTimeLocal) return dateTimeLocal;
        // Create date from local datetime-local input (already in user's timezone)
        // Then convert to UTC ISO string for database storage
        const localDate = new Date(dateTimeLocal);
        return localDate.toISOString();
      };

      const contestData = {
        title: newContest.title,
        game: newContest.game,
        description: newContest.description,
        prize_pool: parseFloat(newContest.prize_pool),
        first_prize: newContest.first_prize ? parseFloat(newContest.first_prize) : null,
        second_prize: newContest.second_prize ? parseFloat(newContest.second_prize) : null,
        third_prize: newContest.third_prize ? parseFloat(newContest.third_prize) : null,
        entry_fee: parseFloat(newContest.entry_fee),
        max_participants: parseInt(newContest.max_participants),
        start_date: convertLocalToUTC(newContest.start_date),
        end_date: convertLocalToUTC(newContest.end_date),
        status: newContest.status,
        image_url: newContest.image_url
      };

      const { error } = await supabase
        .from('contests')
        .insert([contestData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contest created successfully",
      });

      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating contest:', error);
      toast({
        title: "Error",
        description: "Failed to create contest",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewContest({
      title: "",
      game: "",
      description: "",
      prize_pool: "",
      first_prize: "",
      second_prize: "",
      third_prize: "",
      entry_fee: "",
      max_participants: "",
      start_date: "",
      end_date: "",
      status: "upcoming",
      image_url: ""
    });
  };

  const handleDeleteContest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      return;
    }

    try {
      // Use admin function to delete contest (bypasses RLS)
      const { data, error } = await supabase.rpc('admin_delete_contest', {
        p_contest_id: id
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Contest deleted successfully",
        });
        // Refresh the contests list
        loadContests();
      } else {
        // Show specific message for contests with participants
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast({
        title: "Error",
        description: "Failed to delete contest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-500";
      case "upcoming": return "bg-blue-500/20 text-blue-500";
      case "ended": return "bg-gray-500/20 text-gray-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const timeUntilStart = (dateTime: string) => {
    const now = new Date();
    const start = new Date(dateTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading contests...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Contests</p>
                <p className="text-3xl font-gaming font-bold text-green-500">{activeContests}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contests</p>
                <p className="text-3xl font-gaming font-bold text-blue-500">{totalContests}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Contest Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-gaming">Add New Contest</CardTitle>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="font-gaming">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-gaming">Create New Contest</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contest Title</Label>
                        <Input
                          value={newContest.title}
                          onChange={(e) => setNewContest({...newContest, title: e.target.value})}
                          placeholder="BGMI Championship 2024"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Game</Label>
                        <Select value={newContest.game} onValueChange={(value) => setNewContest({...newContest, game: value})}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select game" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BGMI">BGMI</SelectItem>
                            <SelectItem value="Free Fire">Free Fire</SelectItem>
                            <SelectItem value="PUBG">PUBG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={newContest.description}
                        onChange={(e) => setNewContest({...newContest, description: e.target.value})}
                        placeholder="Contest description"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Prize Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Prize Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Prize Pool (₹)</Label>
                        <Input
                          type="number"
                          value={newContest.prize_pool}
                          onChange={(e) => setNewContest({...newContest, prize_pool: e.target.value})}
                          placeholder="50000"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Entry Fee (₹)</Label>
                        <Input
                          type="number"
                          value={newContest.entry_fee}
                          onChange={(e) => setNewContest({...newContest, entry_fee: e.target.value})}
                          placeholder="100"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>1st Prize (₹)</Label>
                        <Input
                          type="number"
                          value={newContest.first_prize}
                          onChange={(e) => setNewContest({...newContest, first_prize: e.target.value})}
                          placeholder="25000"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>2nd Prize (₹)</Label>
                        <Input
                          type="number"
                          value={newContest.second_prize}
                          onChange={(e) => setNewContest({...newContest, second_prize: e.target.value})}
                          placeholder="15000"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>3rd Prize (₹)</Label>
                        <Input
                          type="number"
                          value={newContest.third_prize}
                          onChange={(e) => setNewContest({...newContest, third_prize: e.target.value})}
                          placeholder="10000"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Contest Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Contest Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Maximum Participants</Label>
                        <Input
                          type="number"
                          value={newContest.max_participants}
                          onChange={(e) => setNewContest({...newContest, max_participants: e.target.value})}
                          placeholder="500"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contest Status</Label>
                        <Select value={newContest.status} onValueChange={(value) => setNewContest({...newContest, status: value})}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ended">Ended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={newContest.start_date}
                          onChange={(e) => setNewContest({...newContest, start_date: e.target.value})}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={newContest.end_date}
                          onChange={(e) => setNewContest({...newContest, end_date: e.target.value})}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Contest Image */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Contest Image
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label>Image URL</Label>
                          <Input
                            value={newContest.image_url}
                            onChange={(e) => setNewContest({...newContest, image_url: e.target.value})}
                            placeholder="Image URL or upload file"
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button variant="outline" type="button" className="px-4">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      {newContest.image_url && (
                        <div className="border rounded-lg p-4 bg-muted/20">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <img 
                            src={newContest.image_url.startsWith('data:') ? newContest.image_url : `${newContest.image_url}?t=${Date.now()}`} 
                            alt="Contest preview" 
                            className="w-full max-w-md h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button onClick={handleAddContest} className="font-gaming bg-primary">
                    Create Contest
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Contests List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-gaming">Existing Contests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contests.map((contest) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-gaming font-bold text-lg">{contest.title}</h3>
                      <Badge className={getStatusColor(contest.status || "upcoming")}>
                        {contest.status}
                      </Badge>
                      {contest.status !== "ended" && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {timeUntilStart(contest.start_date)}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Game</p>
                        <p className="font-medium">{contest.game}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prize Pool</p>
                        <p className="font-gaming font-bold text-green-500">₹{contest.prize_pool.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                        <p className="font-medium">₹{contest.entry_fee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Time</p>
                        <p className="font-medium">{new Date(contest.start_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{contest.participant_count || 0}/{contest.max_participants} players</span>
                      </div>
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${((contest.participant_count || 0) / contest.max_participants) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteContest(contest.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestManager;