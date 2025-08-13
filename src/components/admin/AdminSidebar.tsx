import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  UserCheck, 
  Award, 
  LogOut,
  Menu,
  X,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const AdminSidebar = ({ activeSection, onSectionChange, isMobileOpen, onMobileToggle }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { adminLogout, adminUser } = useAdminAuth();
  const isMobile = useIsMobile();

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "contests", label: "Contest Manager", icon: Trophy },
    { id: "users", label: "User Management", icon: Users },
    { id: "joinedUsers", label: "Contest Joins", icon: UserCheck },
    { id: "customChallenges", label: "Custom Challenges Info", icon: Target },
    { id: "winners", label: "Winning Verification", icon: Award },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    // Close mobile sidebar after selection
    if (isMobile) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        bg-card border-r border-border transition-all duration-300 flex flex-col
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-64 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0` 
          : `${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`
        }
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobile) && (
              <h2 className="font-gaming font-bold text-lg text-foreground">Admin Panel</h2>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2"
              >
                {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileToggle}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start font-gaming ${!isCollapsed || isMobile ? 'px-4' : 'px-2'}`}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <item.icon className="w-5 h-5" />
                  {(!isCollapsed || isMobile) && <span className="ml-3">{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {(!isCollapsed || isMobile) && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground">{adminUser?.username}</p>
              <p className="text-xs text-muted-foreground">{adminUser?.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            className={`w-full font-gaming ${!isCollapsed || isMobile ? 'px-4' : 'px-2'}`}
            onClick={adminLogout}
          >
            <LogOut className="w-4 h-4" />
            {(!isCollapsed || isMobile) && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;