import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Dashboard from "@/components/admin/Dashboard";
import ContestManager from "@/components/admin/ContestManager";
import UserManagement from "@/components/admin/UserManagement";
import ContestJoinsList from "@/components/admin/ContestJoinsList";
import WinnerVerification from "@/components/admin/WinnerVerification";
import CustomChallengesList from "@/components/admin/CustomChallengesList";
import { useAdminData } from "@/hooks/useAdminData";

const Admin = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { dashboardStats, loading } = useAdminData();
  const isMobile = useIsMobile();

  // Authentication is handled by ProtectedAdminRoute wrapper
  // This component only renders when user is authenticated

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard 
            dashboardStats={dashboardStats}
            loading={loading}
          />
        );
      case "contests":
        return <ContestManager />;
      case "users":
        return <UserManagement />;
      case "joinedUsers":
        return <ContestJoinsList />;
      case "winners":
        return <WinnerVerification />;
      case "customChallenges":
        return <CustomChallengesList />;
      default:
        return (
          <Dashboard 
            dashboardStats={dashboardStats}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />
      
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        {isMobile && (
          <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
            <h1 className="font-gaming font-bold text-lg text-foreground">Admin Panel</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(true)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        <main className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Admin;