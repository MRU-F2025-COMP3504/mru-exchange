import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  getSession,
  onAuthStateChange,
  signIn,
  signOut,
  signUp,
} from '@features/auth/api';
import type { UseUserReturn } from '@features/auth/types';

export default function useAuth(): UseUserReturn {
  const [user, setAuthUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    void getSession().then((session) => {
      if (session.ok) {
        setAuthUser(session.data.user);
      }
    });

    // Listen for auth changes
    const subscription = onAuthStateChange((_, session) => {
      if (session.ok) {
        setAuthUser(session.data.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    signUp,
    signIn,
    signOut,
  };
}
