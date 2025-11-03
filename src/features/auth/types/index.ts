import {
  AuthError,
  type Session,
  type User,
} from '@supabase/supabase-js';
import type { PromiseResult } from '@shared/types';

export type AuthPromiseResult<T> = PromiseResult<T, AuthError>;

export interface UserSession {
  user: User | null;
  session: Session | null;
}

export interface UseUserReturn {
  user: User | null;
  signUp(email: string, password: string): AuthPromiseResult<UserSession>;
  signIn(email: string, password: string): AuthPromiseResult<UserSession>;
  signOut(): AuthPromiseResult<null>;
}
