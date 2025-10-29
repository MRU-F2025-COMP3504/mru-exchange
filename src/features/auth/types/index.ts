import {
  AuthError,
  type Session,
  type User as AuthUser,
} from '@supabase/supabase-js';
import type { PromiseResult } from '@shared/types';

export type AuthPromiseResult<T> = PromiseResult<T, AuthError>;

export interface UserSession {
  user: AuthUser | null;
  session: Session | null;
}

export interface UseAuthUserReturn {
  authUser: AuthUser | null;
  signUp: (email: string, password: string) => AuthPromiseResult<UserSession>;
  signIn: (email: string, password: string) => AuthPromiseResult<UserSession>;
  signOut: () => AuthPromiseResult<{}>;
}
