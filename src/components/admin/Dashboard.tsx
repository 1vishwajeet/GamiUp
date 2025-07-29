import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Activity, TrendingUp } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { DashboardStats } from "@/hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProps {
  dashboardStats: DashboardStats;
  loading: boolean;
}

const Dashboard = ({ dashboardStats, loading }: DashboardProps) => {
  const { adminUser } = useAdminAuth();

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Total Contests",
      value: dashboardStats.totalContests.toString(),
      change: "+8%",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Active Contests",
      value: dashboardStats.activeContests.toString(),
      change: "+3",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "Total Entries",
      value: dashboardStats.totalEntries.toString(),
      change: "+25%",
      icon: TrendingUp,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-gaming font-bold text-foreground">
                  Welcome back, {adminUser?.username}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Managing GamiZN Platform - {adminUser?.role}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">System Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mb-2" />
                    ) : (
                      <p className="text-2xl font-gaming font-bold text-foreground">
                        {stat.value}
                      </p>
                    )}
                    <p className="text-sm text-green-500">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Website Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-gaming">Website Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website Name:</span>
                    <span>Esports Contest Platform</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span>99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Status:</span>
                    <span className="text-green-500">Operational</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Users Today:</span>
                    {loading ? <Skeleton className="h-4 w-8" /> : <span>{dashboardStats.newUsersToday}</span>}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contests Created:</span>
                    {loading ? <Skeleton className="h-4 w-8" /> : <span>{dashboardStats.contestsCreated}</span>}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payments Processed:</span>
                    {loading ? <Skeleton className="h-4 w-8" /> : <span>{dashboardStats.paymentsProcessed}</span>}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Support Tickets:</span>
                    <span>8</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;