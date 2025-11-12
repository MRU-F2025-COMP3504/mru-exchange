import type { PromiseResult, Result } from '@shared/types/result.ts';
import { AuthError, type Session, type User } from '@supabase/supabase-js';

export type AuthPromiseResult<T> = PromiseResult<T, AuthError>;

export interface UserSession {
  user: Result<User>;
  session: Result<Session>;
}