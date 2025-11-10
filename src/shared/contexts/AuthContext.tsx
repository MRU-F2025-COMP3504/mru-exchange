import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../api/database/connection.ts';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Create user record in database on sign in
      if (_event === 'SIGNED_IN' && session?.user) {
        checkAndCreateUserInfo(session.user).catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create user record in User_Information table if it doesn't exist
  const checkAndCreateUserInfo = async (user: User) => {
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('User_Information')
        .select('id')
        .eq('supabase_id', user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        if (user.email) {
          const { error: insertError } = await supabase.from('User_Information').insert({
            supabase_id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            user_name: user.email.split('@')[0],
            is_deleted: false,
            is_flagged: false,
          });

          if (insertError) {
            console.error('Error creating user info:', insertError);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user info:', error);
    }
  };

  // Register new user with @mtroyal.ca email
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      if (!email.endsWith('@mtroyal.ca')) {
        return {
          error: { message: 'Please use a valid @mtroyal.ca email address' },
        };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) return { error };

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      if (!email.endsWith('@mtroyal.ca')) {
        return {
          error: { message: 'Please use a valid @mtroyal.ca email address' },
        };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign out current user
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Resend verification email for signup
  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
