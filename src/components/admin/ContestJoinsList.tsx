import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, CheckCircle } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";

const ContestJoinsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { contestParticipants, loading } = useAdminData();

  const filteredJoins = contestParticipants.filter(join =>
    join.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    join.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    join.bgmiUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    join.contestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    join.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    join.contactNumber.includes(searchTerm)
  );

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "bg-green-500/20 text-green-500";
      case "Pending": return "bg-yellow-500/20 text-yellow-500";
      case "Failed": return "bg-red-500/20 text-red-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const successfulPayments = contestParticipants.filter(join => join.paymentStatus === "Success").length;
  const totalRevenue = contestParticipants.reduce((sum, join) => 
    join.paymentStatus === "Success" ? sum + join.entryFee : sum, 0
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Joins</p>
                {loading ? (
                  <Skeleton className="h-9 w-8" />
                ) : (
                  <p className="text-3xl font-gaming font-bold text-blue-500">{contestParticipants.length}</p>
                )}
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Payments</p>
                {loading ? (
                  <Skeleton className="h-9 w-8" />
                ) : (
                  <p className="text-3xl font-gaming font-bold text-green-500">{successfulPayments}</p>
                )}
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-gaming font-bold text-purple-500">₹{totalRevenue.toLocaleString()}</p>
                )}
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-gaming">Contest Join User List</CardTitle>
              <p className="text-sm text-muted-foreground">
                Users who have successfully joined contests and made payments
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search joins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Joins Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>User Name</TableHead>
                 <TableHead>User ID</TableHead>
                 <TableHead>Game ID</TableHead>
                 <TableHead>Contact Number</TableHead>
                 <TableHead>Contest Name</TableHead>
                 <TableHead>Contest Type</TableHead>
                 <TableHead>Transaction ID</TableHead>
                 <TableHead>Join Date/Time</TableHead>
                 <TableHead>Payment Status</TableHead>
               </TableRow>
             </TableHeader>
            <TableBody>
              {filteredJoins.map((join) => (
                <motion.tr
                  key={join.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-muted/50"
                >
                   <TableCell className="font-medium">{join.userName}</TableCell>
                   <TableCell>
                     <code className="text-sm bg-muted px-2 py-1 rounded">{join.userId}</code>
                   </TableCell>
                   <TableCell>
                     <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                       {join.bgmiUserId}
                     </code>
                   </TableCell>
                   <TableCell>{join.contactNumber}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={join.contestName}>
                      {join.contestName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{join.contestType}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {join.transactionId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(join.joinDateTime).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(join.joinDateTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(join.paymentStatus)}>
                      {join.paymentStatus}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredJoins.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contest joins found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContestJoinsList;