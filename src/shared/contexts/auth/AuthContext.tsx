import { createContext } from 'react';
import type { Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import type { AuthPromiseResult, UserSession } from '@shared/types';

export interface AuthContextType {
  user: Result<User>;
  loading: boolean;
  signUp(email: string, password: string, firstName: string, lastName: string): AuthPromiseResult<UserSession>;
  signIn(email: string, password: string): AuthPromiseResult<UserSession>;
  signOut(): AuthPromiseResult<null>;
  resendEmailVerification(email: string): AuthPromiseResult<null>;
  resetPassword(email: string): AuthPromiseResult<null>;
  updatePassword(password: string): AuthPromiseResult<User>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);