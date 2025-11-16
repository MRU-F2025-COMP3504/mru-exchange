import type { PromiseResult, Result } from '@shared/types/result.ts';
import { AuthError, type Session, type User } from '@supabase/supabase-js';

/**
 * The supabase user authentication result of type {@link PromiseResult}.
 *
 * @see {@link PromiseResult}
 */
export type AuthPromiseResult<T> = PromiseResult<T, AuthError>;

/**
 * A wrapper for validating the Supabase {@link User} and {@link Session}.
 */
export interface UserSession {
  /**
   * The wrapped result of the Supabase {@link User} authentication.
   */
  user: Result<User>;

  /**
   * The wrapped result of the Supabase {@link Session} authentication.
   */
  session: Result<Session>;
}

export interface UserCredentialsBuilder {
  email: (email: string) => Result<this>;
  password: (password: string) => Result<this>;
  name: (first: string, last: string) => Result<this>;
}
