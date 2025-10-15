import { useState, useEffect } from 'react';
import { index } from '../../features/auth/api';
import type { User } from '@supabase/supabase-js';
import type { UserInformation } from '../types/database.types';

/**
 * Hook to manage authentication state
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    index.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadUserInfo(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = index.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserInfo(session.user.id);
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserInfo = async (supabaseId: string) => {
    const { data } = await index.getUserInfo(supabaseId);
    setUserInfo(data);
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    userName?: string,
  ) => {
    const result = await index.signUp(
      email,
      password,
      firstName,
      lastName,
      userName,
    );
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await index.signIn(email, password);
    return result;
  };

  const signOut = async () => {
    const result = await index.signOut();
    setUser(null);
    setUserInfo(null);
    return result;
  };

  const updateUserInfo = async (updates: {
    first_name?: string;
    last_name?: string;
    user_name?: string;
    email?: string;
  }) => {
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const result = await index.updateUserInfo(user.id, updates);
    if (result.data) {
      setUserInfo(result.data);
    }
    return result;
  };

  return {
    user,
    userInfo,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserInfo,
    isAuthenticated: !!user,
  };
};
