import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  whatsapp_number?: string;
  wallet_balance: number;
  games_played: number;
  total_winnings: number;
  favorite_game: string;
  skill_level: string;
  achievements: string[];
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, username: string, email: string, whatsappNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("AuthProvider initializing...");
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Cleanup function to clear all auth state
  const cleanupAuthState = () => {
    // Clear all localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Clear all sessionStorage items
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    setUser(null);
    setUserProfile(null);
    setSession(null);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserProfile(null);
          setSession(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile after authentication
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session on initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          whatsapp_number: data.whatsapp_number,
          wallet_balance: Number(data.wallet_balance),
          games_played: data.games_played,
          total_winnings: Number(data.total_winnings),
          favorite_game: data.favorite_game,
          skill_level: data.skill_level,
          achievements: data.achievements,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (name: string, username: string, email: string, whatsappNumber: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/gamer-place`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            username: username,
            whatsapp_number: whatsappNumber,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    userProfile,
    session,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider. Context value:", context);
    console.error("AuthContext:", AuthContext);
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};