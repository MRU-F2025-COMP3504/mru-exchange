import { useState, useEffect } from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
import {
  getSession,
  onAuthStateChange,
  signIn,
  signOut,
  signUp,
} from '@features/auth/api';
import type { UseAuthUserReturn } from '@features/auth/types';

export default function useAuthUser(): UseAuthUserReturn {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getSession().then((result) => {
      setAuthUser(result.ok ? result.data.user : null);
    });

    // Listen for auth changes
    const subscription = onAuthStateChange(async (_event, result) => {
      setAuthUser(result.ok ? result.data.user : null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    authUser,
    signUp,
    signIn,
    signOut,
  };
}
