import { ReactNode, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from '@/components/admin/AdminLogin';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  // Additional check on component mount
  useEffect(() => {
    const sessionActive = sessionStorage.getItem('admin-session-active');
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (!sessionActive || adminAuth !== 'true') {
      // Clear any remaining auth state
      sessionStorage.removeItem('admin-session-active');
      sessionStorage.removeItem('adminAuth');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const sessionActive = sessionStorage.getItem('admin-session-active');
  const adminAuth = sessionStorage.getItem('adminAuth');
  
  if (!isAdminAuthenticated || !sessionActive || adminAuth !== 'true') {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;