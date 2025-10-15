import supabase from '@shared/api/supabase';
import type { UserInformation } from '@shared/types/database.types.ts';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

export async function onSignUp(email: string, password: string, firstName?: string, lastName?: string, username?: string) {
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
}

export async function onSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function onSignOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function onResetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { data, error };
}

export async function onUpdatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

export async function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getUserInfo(supabaseId: string) {
  const { data, error } = await supabase
    .from('User_Information')
    .select('*')
    .eq('supabase_id', supabaseId)
    .single();

  return { data, error };
}

export async function getUserInfoById: async (id: number) {
  const { data, error } = await supabase
    .from('User_Information')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function updateUserInfo(
  supabaseId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    user_name?: string;
    email?: string;
  }
) {
  const { data, error } = await supabase
    .from('User_Information')
    .update(updates)
    .eq('supabase_id', supabaseId)
    .select()
    .single();

  return { data, error };
}

export async function deleteUser(supabaseId: string) {
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
}

export async function flagUser(supabaseId: string, flagType: string) {
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
}