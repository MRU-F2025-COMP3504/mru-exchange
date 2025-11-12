import { query, supabase } from '@shared/api';
import { ok, err, present } from '@shared/utils';
import {
  type AuthChangeEvent,
  AuthError,
  type AuthResponse,
  type Session,
  type Subscription,
  type User,
} from '@supabase/supabase-js';
import type { AuthPromiseResult, DatabaseQuery, Result, UserProfile, UserSession } from '@shared/types';

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

export async function getUser(): AuthPromiseResult<User> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return err(error);
  }

  return ok(data.user);
}

export async function getUserProfile(): DatabaseQuery<UserProfile, '*'> {
  const user = await getUser();

  if (user.ok) {
    return query(
      await supabase
        .from('User_Information')
        .select('*')
        .eq('supabase_id', user.data.id)
        .single()
    )
  }

  return user;
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): AuthPromiseResult<UserSession> {
  const verify = verifyEmail(email);

  if (!verify.ok) {
    return verify;
  }

  return authenticate(
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    }),
  );
}

export async function signIn(
  email: string,
  password: string,
): AuthPromiseResult<UserSession> {
  const verify = verifyEmail(email);

  if (verify.ok) {
    return authenticate(
      await supabase.auth.signInWithPassword({
        email,
        password,
      }),
    );
  }

  return verify;
}

export async function signOut(): AuthPromiseResult<null> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return err(error);
  }

  return ok(null);
}

export async function resendEmailVerification(email: string): AuthPromiseResult<null> {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    return err(error);
  }

  return ok(null);
}

export async function resetPassword(email: string): AuthPromiseResult<null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return err(error);
  }

  return ok(null);
}

export async function updatePassword(
  password: string,
): AuthPromiseResult<User> {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return err(error);
  }

  return ok(data.user);
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

function authenticate(response: AuthResponse): Result<UserSession, AuthError> {
  const { data, error } = response;

  if (error) {
    return err(error);
  }

  return ok({
    user: present(data.user),
    session: present(data.session),
  });
}

function verifyEmail(email: string): Result<null, AuthError> {
  if (!email.endsWith('@mtroyal.ca')) {
    return err(
      new AuthError(
        'Only @mtroyal.ca email addresses are allowed',
        401,
        'email_address_invalid',
      ),
    );
  }

  return ok(null);
}