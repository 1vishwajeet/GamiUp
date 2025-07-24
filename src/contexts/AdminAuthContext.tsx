import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  adminUser: { username: string; role: string; email: string } | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials as specified by user
const ADMIN_CREDENTIALS = {
  username: 'Admin',
  password: 'admin7976'
};

// Session timeout (24 hours in milliseconds)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Cleanup function to clear all admin auth state
  const clearAdminSession = () => {
    // Clear admin session storage
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminLoginTime');
    sessionStorage.removeItem('adminUserData');
    sessionStorage.removeItem('adminSessionId');
    sessionStorage.removeItem('admin-session-active');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  useEffect(() => {
    // Clear any existing admin auth state on initialization
    clearAdminSession();

    // Clear admin session on page visibility change (tab switch/blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAdminSession();
        supabase.auth.signOut();
      }
    };

    // Clear admin session before page unload/reload
    const handleBeforeUnload = () => {
      clearAdminSession();
      supabase.auth.signOut();
    };

    // Clear session when navigating away from admin page
    const handlePopState = () => {
      if (window.location.pathname !== '/admin') {
        clearAdminSession();
        supabase.auth.signOut();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Check session after setting up listeners
    checkAdminSession();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      clearAdminSession();
    };
  }, []);

  const checkAdminSession = async () => {
    try {
      // Check if admin session is active in current tab
      const sessionActive = sessionStorage.getItem('admin-session-active');
      const adminAuth = sessionStorage.getItem('adminAuth');
      
      if (!sessionActive || adminAuth !== 'true') {
        clearAdminSession();
        setLoading(false);
        return;
      }

      // Check admin session data
      const loginTime = sessionStorage.getItem('adminLoginTime');
      const adminUserData = sessionStorage.getItem('adminUserData');
      const sessionId = sessionStorage.getItem('adminSessionId');
      
      if (loginTime && adminUserData && sessionId) {
        const timeDiff = Date.now() - parseInt(loginTime);
        
        if (timeDiff < SESSION_TIMEOUT) {
          const userData = JSON.parse(adminUserData);
          setIsAdminAuthenticated(true);
          setAdminUser(userData);
        } else {
          // Session expired, clear storage
          clearAdminSession();
        }
      } else {
        // No valid admin session data
        clearAdminSession();
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      clearAdminSession();
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check the hardcoded credentials
      if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
        return false;
      }

      // Create admin user data with hardcoded credentials
      const adminUserData = {
        username: username,
        role: 'Super Admin',
        email: 'admin@gamerarena.com',
        userId: 'admin-' + Date.now() // Generate a unique admin ID
      };

      setIsAdminAuthenticated(true);
      setAdminUser(adminUserData);
      
      // Create unique session ID for this browser session
      const sessionId = Date.now().toString() + Math.random().toString(36);
      
      // Store session info in sessionStorage for current tab only
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminLoginTime', Date.now().toString());
      sessionStorage.setItem('adminUserData', JSON.stringify(adminUserData));
      sessionStorage.setItem('adminSessionId', sessionId);
      sessionStorage.setItem('admin-session-active', 'true');
      
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const adminLogout = () => {
    clearAdminSession();
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        isAdminAuthenticated, 
        adminLogin, 
        adminLogout, 
        adminUser,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};