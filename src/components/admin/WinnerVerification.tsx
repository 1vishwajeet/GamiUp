import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, CheckCircle, XCircle, Eye, Award, Clock } from "lucide-react";
import { useAdminData, WinnerSubmission } from "@/hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";

const WinnerVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { winnerSubmissions, loading, updateWinnerStatus } = useAdminData();
  const [selectedSubmission, setSelectedSubmission] = useState<WinnerSubmission | null>(null);

  const filteredSubmissions = winnerSubmissions.filter(submission =>
    submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.contestName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    updateWinnerStatus(id, "Approved");
  };

  const handleReject = (id: string) => {
    updateWinnerStatus(id, "Rejected");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/20 text-yellow-500";
      case "Approved": return "bg-green-500/20 text-green-500";
      case "Rejected": return "bg-red-500/20 text-red-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const pendingCount = winnerSubmissions.filter(sub => sub.status === "Pending").length;
  const approvedCount = winnerSubmissions.filter(sub => sub.status === "Approved").length;
  const totalPrizeApproved = winnerSubmissions
    .filter(sub => sub.status === "Approved")
    .reduce((sum, sub) => sum + sub.prizeAmount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Verifications</p>
                {loading ? (
                  <Skeleton className="h-9 w-8" />
                ) : (
                  <p className="text-3xl font-gaming font-bold text-yellow-500">{pendingCount}</p>
                )}
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-gaming">Winner Verification</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and verify winner submissions from completed contests
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Contest Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Kills</TableHead>
                <TableHead>Prize Amount</TableHead>
                <TableHead>Submission Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{submission.userName}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{submission.userId}</code>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={submission.contestName}>
                      {submission.contestName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-bold">#{submission.rank}</span>
                      {submission.rank === 1 && <span className="ml-1">🏆</span>}
                      {submission.rank === 2 && <span className="ml-1">🥈</span>}
                      {submission.rank === 3 && <span className="ml-1">🥉</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.kills} kills</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-gaming font-bold text-green-500">
                      ₹{submission.prizeAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(submission.submissionDateTime).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(submission.submissionDateTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-4xl h-[85vh] max-h-[700px] p-0 overflow-hidden flex flex-col">
                          <div className="flex flex-col h-full max-h-full">
                            <DialogHeader className="flex-shrink-0 p-4 sm:p-6 border-b">
                              <DialogTitle className="font-gaming">Winner Submission Details</DialogTitle>
                            </DialogHeader>

                            {selectedSubmission && (
                              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                                <div className="space-y-6">
                                  {/* Basic Details Grid */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">User Name</p>
                                      <p className="font-medium break-words">{selectedSubmission.userName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">User ID</p>
                                      <p className="font-mono text-xs sm:text-sm break-all">{selectedSubmission.userId}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Contest</p>
                                      <p className="break-words">{selectedSubmission.contestName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Rank</p>
                                      <p className="font-bold">#{selectedSubmission.rank}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Number of Kills</p>
                                      <p>{selectedSubmission.kills}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Prize Amount</p>
                                      <p className="font-gaming font-bold text-green-500">
                                        ₹{selectedSubmission.prizeAmount.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Screenshot Section */}
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-3">Screenshot Proof</p>
                                    <div className="flex justify-center">
                                      <img
                                        src={selectedSubmission.screenshotProof}
                                        alt="Winner proof screenshot"
                                        className="max-w-full max-h-[250px] sm:max-h-[350px] object-contain rounded-lg border border-border"
                                      />
                                    </div>
                                  </div>

                                  {/* Additional Notes */}
                                  {selectedSubmission.additionalNotes && (
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-3">Additional Notes</p>
                                      <Textarea
                                        value={selectedSubmission.additionalNotes}
                                        readOnly
                                        className="min-h-16 max-h-24 resize-none"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons - Always visible at bottom */}
                            {selectedSubmission?.status === "Pending" && (
                              <div className="flex-shrink-0 p-4 sm:p-6 border-t bg-background">
                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                  <Button
                                    onClick={() => handleApprove(selectedSubmission.id)}
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(selectedSubmission.id)}
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {submission.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:text-green-600"
                            onClick={() => handleApprove(submission.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleReject(submission.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No winner submissions found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WinnerVerification;