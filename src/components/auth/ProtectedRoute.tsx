import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user session is active in current tab
    const sessionActive = sessionStorage.getItem('user-session-active');
    
    if (!loading && (!user || !session || !sessionActive)) {
      // Clear any remaining auth state and redirect
      sessionStorage.removeItem('user-session-active');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, session, navigate]);

  // Additional check on component mount
  useEffect(() => {
    const sessionActive = sessionStorage.getItem('user-session-active');
    if (!sessionActive) {
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

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

  const sessionActive = sessionStorage.getItem('user-session-active');
  if (!user || !session || !sessionActive) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;