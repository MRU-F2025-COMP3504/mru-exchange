import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import {
  type AuthChangeEvent,
  AuthError,
  type Session,
  type Subscription,
  type User as AuthUser,
} from '@supabase/supabase-js';
import type { AuthPromiseResult, UserSession } from '@features/auth/types';
import type { Result } from '@shared/types';

export async function getSession(): AuthPromiseResult<Session> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (session) {
    return ok(session);
  } else if (error) {
    return err(error);
  }

  return err(new AuthError('No session found', 401, 'session_not_found'));
}

export async function getCurrentUser(): AuthPromiseResult<AuthUser> {
  const { data, error } = await supabase.auth.getUser();

  return error ? err(error) : ok(data.user);
}

export async function signUp(
  email: string,
  password: string,
): AuthPromiseResult<UserSession> {
  if (!email.endsWith('@mtroyal.ca')) {
    return err(
      new AuthError(
        'Only @mtroyal.ca email addresses are allowed',
        401,
        'email_address_invalid',
      ),
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return error ? err(error) : ok(data);
}

export async function signIn(
  email: string,
  password: string,
): AuthPromiseResult<UserSession> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error ? err(error) : ok(data);
}

export async function signOut(): AuthPromiseResult<{}> {
  const { error } = await supabase.auth.signOut();

  return error ? err(error) : ok({});
}

export async function resetPassword(email: string): AuthPromiseResult<{}> {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return error ? err(error) : ok(data);
}

export async function updatePassword(
  password: string,
): AuthPromiseResult<AuthUser> {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  return error ? err(error) : ok(data.user);
}

export function onAuthStateChange(
  callback: (
    event: AuthChangeEvent,
    session: Result<Session, AuthError>,
  ) => void,
): Subscription {
  const subscriber = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      callback(event, ok(session));
    } else {
      callback(
        event,
        err(new AuthError('No session found', 401, 'session_not_found')),
      );
    }
  });

  return subscriber.data.subscription;
}
