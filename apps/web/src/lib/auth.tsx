'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  Session, 
  User,
  AuthChangeEvent,
  AuthError
} from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Extended session type to include Google Calendar tokens
export interface ExtendedSession extends Session {
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
  refreshSession: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  refreshSession: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<ExtendedSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  // Create the Supabase client for client components
  const supabase = createClient();

  // Refresh session function that can be called explicitly
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      console.log('[AUTH] Refreshing session...');
      
      // Get current session using client component client
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[AUTH] Error refreshing session:', error);
        return;
      }
      
      if (currentSession) {
        console.log('[AUTH] Session refreshed successfully, User ID:', currentSession.user.id);
        setSession(currentSession as ExtendedSession);
        setUser(currentSession.user);
      } else {
        console.log('[AUTH] No session found during refresh');
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('[AUTH] Exception refreshing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state from Supabase
  useEffect(() => {
    let mounted = true;
    
    const setData = async () => {
      try {
        console.log('[AUTH] Initializing auth state...');
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AUTH] Error getting initial session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
          }
          return;
        }

        if (mounted) {
          if (session) {
            console.log('[AUTH] Initial session found, User ID:', session.user.id);
            setSession(session as ExtendedSession);
            setUser(session.user);
          } else {
            console.log('[AUTH] No initial session found');
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('[AUTH] Exception getting initial session:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Initial session fetch
    setData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('[AUTH] Auth state changed:', event, 'Has session:', !!currentSession);
        
        if (mounted) {
          if (currentSession) {
            console.log('[AUTH] Setting user from auth change:', currentSession.user.id);
            setSession(currentSession as ExtendedSession);
            setUser(currentSession.user);
          } else {
            console.log('[AUTH] Clearing user from auth change');
            setSession(null);
            setUser(null);
          }
          setIsLoading(false);
        }

        // Refresh server-side data when auth state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[AUTH] Refreshing router after auth event');
          router.refresh();
        }
      }
    );

    // Cleanup subscription
    return () => {
      console.log('[AUTH] Cleaning up auth subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('[AUTH] Starting Google sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile https://www.googleapis.com/auth/calendar',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        console.error('[AUTH] Error during Google sign in:', error);
        throw error;
      }
      
      console.log('[AUTH] Sign in initiated, redirecting to OAuth provider');
    } catch (error) {
      console.error('[AUTH] Exception during Google sign in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('[AUTH] Signing out...');
      
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/windows
      });
      
      if (error) {
        console.error('[AUTH] Error signing out:', error);
        throw error;
      }
      
      // Clear state
      setSession(null);
      setUser(null);
      
      // Navigate to home page after sign out
      console.log('[AUTH] Sign out successful, redirecting to home');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('[AUTH] Exception during sign out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Consider authenticated only if we have both a user and a valid session
  const isAuthenticated = !!user && !!session;

  // Provider values
  const value = {
    user,
    session,
    isLoading,
    signInWithGoogle,
    signOut,
    isAuthenticated,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 