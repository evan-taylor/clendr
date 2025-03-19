'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import { 
  Session, 
  User,
  Provider,
  AuthError
} from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Extended session type to include Google Calendar tokens
export interface ExtendedSession extends Omit<Session, 'provider_token' | 'provider_refresh_token'> {
  provider_token?: string;
  provider_refresh_token?: string;
}

// Define types for our context
type AuthContextType = {
  user: User | null;
  session: ExtendedSession | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<ExtendedSession | null>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  refreshSession: async () => null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<ExtendedSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Create the Supabase client for client components
  const supabase = createClient();

  // Refresh session function that can be called explicitly
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      
      if (data && data.session) {
        // Create an ExtendedSession from the Session
        const extendedSession: ExtendedSession = {
          ...data.session,
          provider_token: data.session.provider_token || undefined,
          provider_refresh_token: data.session.provider_refresh_token || undefined,
        };
        
        setSession(extendedSession);
        setUser(data.session.user);
        return extendedSession;
      }
      return null;
    } catch (error) {
      console.error('Exception during session refresh:', error);
      return null;
    }
  }, [supabase.auth]);

  // Function to load and set the current session
  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const extendedSession: ExtendedSession = {
          ...session,
          provider_token: session.provider_token || undefined,
          provider_refresh_token: session.provider_refresh_token || undefined,
        };
        
        setSession(extendedSession);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Initialize with current session
  useEffect(() => {
    loadSession();
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const extendedSession: ExtendedSession = {
            ...session,
            provider_token: session.provider_token || undefined,
            provider_refresh_token: session.provider_refresh_token || undefined,
          };
          
          setSession(extendedSession);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, loadSession]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent', 
            include_granted_scopes: 'true',
            response_type: 'code'
          }
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setSession(null);
      setUser(null);
      
      // Only redirect if we're not already at the login or home page
      if (pathname !== '/login' && pathname !== '/') {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth, router, pathname]);

  // Memoize the auth context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    refreshSession,
  }), [user, session, isLoading, signInWithGoogle, signOut, refreshSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 