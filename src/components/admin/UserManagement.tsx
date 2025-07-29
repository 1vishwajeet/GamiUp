import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, Trash2, Ban, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type UserProfile = Tables<'profiles'>;

interface UserManagementProps {
  // Remove props - we'll manage users internally
}

const UserManagement = ({}: UserManagementProps) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    setupRealtimeSubscription();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('👥 Loading users using admin function...');
      
      // Check if admin is authenticated
      const adminAuth = sessionStorage.getItem('adminAuth');
      const sessionActive = sessionStorage.getItem('admin-session-active');
      
      if (adminAuth !== 'true' || sessionActive !== 'true') {
        console.log('❌ Admin not authenticated for users');
        setUsers([]);
        return;
      }

      // Use admin function to get users data
      const { data, error } = await supabase.rpc('get_admin_users_full');

      console.log('👥 Users RPC result:', { data, error });

      if (error) {
        console.error('❌ Error loading users:', error);
        throw error;
      }

      setUsers((data || []).map((user: any) => ({
        ...user,
        avatar_url: user.avatar_url || null, // Add missing avatar_url field
      })));
      console.log('✅ Users loaded successfully:', data?.length || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBanUser = async (userId: string) => {
    // For now, we'll just show a message since user status isn't in the profiles table
    toast({
      title: "Feature Coming Soon",
      description: "User ban/unban functionality will be implemented with role management",
    });
    setShowBanDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error", 
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    return "bg-green-500/20 text-green-500"; // Default to Active for now
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-gaming">User Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage all registered users - {users.length} total users
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>Skill Level</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Games Played</TableHead>
                <TableHead>Total Winnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{user.user_id.slice(0, 8)}...</code>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor("Active")}>
                      {user.skill_level || "Beginner"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at || "").toLocaleDateString()}</TableCell>
                  <TableCell>{user.games_played || 0}</TableCell>
                  <TableCell>
                    <span className="font-gaming font-bold text-green-500">
                      ₹{(user.total_winnings || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Full Name</p>
                                  <p className="font-medium">{selectedUser.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">User ID</p>
                                  <p className="font-mono">{selectedUser.user_id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Skill Level</p>
                                  <p>{selectedUser.skill_level || "Beginner"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Favorite Game</p>
                                  <p>{selectedUser.favorite_game || "Not set"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Join Date</p>
                                  <p>{new Date(selectedUser.created_at || "").toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Games Played</p>
                                  <p>{selectedUser.games_played || 0}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Winnings</p>
                                  <p className="font-gaming font-bold text-green-500">
                                    ₹{(selectedUser.total_winnings || 0).toLocaleString()}
                                  </p>
                                </div>
                                
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanDialog(true);
                        }}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.name}? This feature will be implemented with role management.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && handleBanUser(selectedUser.user_id)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;