import { supabase } from '../utils/supabase';
import type { UserInformation } from '../../../shared/types/database.types.ts';

export const authApi = {
  signUp: async (email: string, password: string, firstName?: string, lastName?: string, userName?: string) => {
    if (!email.endsWith('@mtroyal.ca')) {
      return {
        data: null,
        error: { message: 'Only @mtroyal.ca email addresses are allowed' },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { data, null, error };

    return { data, error: null };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { data, error };
  },

  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { data, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  getUserInfo: async (supabaseId: string): Promise<{ data: UserInformation | null; error: any }> => {
    const { data, error } = await supabase
      .from('User_Information')
      .select('*')
      .eq('supabase_id', supabaseId)
      .single();

    return { data, error };
  },

  getUserInfoById: async (id: number): Promise<{ data: UserInformation | null; error: any }> => {
    const { data, error } = await supabase
      .from('User_Information')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  updateUserInfo: async (
    supabaseId: string,
    updates: {
      first_name?: string;
      last_name?: string;
      user_name?: string;
      email?: string;
    }
  ) => {
    const { data, error } = await supabase
      .from('User_Information')
      .update(updates)
      .eq('supabase_id', supabaseId)
      .select()
      .single();

    return { data, error };
  },

  deleteUser: async (supabaseId: string) => {
    const { data, error } = await supabase
      .from('User_Information')
      .update({
        is_deleted: true,
        deleted_on: new Date().toISOString(),
      })
      .eq('supabase_id', supabaseId)
      .select()
      .single();

    return { data, error };
  },

  flagUser: async (supabaseId: string, flagType: string) => {
    const { data, error } = await supabase
      .from('User_Information')
      .update({
        is_flagged: true,
        flagged_type: flagType,
      })
      .eq('supabase_id', supabaseId)
      .select()
      .single();

    return { data, error };
  },
};
