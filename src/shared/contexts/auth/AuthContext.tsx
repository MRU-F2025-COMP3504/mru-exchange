import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Result } from '@shared/types';

/**
 * Represents the authentication context.
 *
 * @see {@link AuthProvider}
 */
export interface AuthContextType {
  /**
   * The current loading state indicates data in transit or processing to completion.
   */
  loading: boolean;

  /**
   * The current user result state.
   */
  user: Result<User>;
}

/**
 * The current reference to the authentication context instance.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
