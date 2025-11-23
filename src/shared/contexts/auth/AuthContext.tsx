import type {
  PromiseResult,
  Result,
  UserPasswordModifier,
  UserSignin,
  UserSignup,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

/**
 * Represents the authentication context.
 *
 * @see {@link AuthProvider}
 */
export interface AuthContext {
  /**
   * The current user result state.
   */
  user: Result<User>;

  /**
   * @see {@link UserAuthentication.signup()} for more information.
   */
  signup: () => UserSignup;

  /**
   * @see {@link UserAuthentication.signin()} for more information.
   */
  signin: () => UserSignin;

  /**
   * @see {@link UserAuthentication.signout()} for more information.
   */
  signout: () => PromiseResult<null>;

  /**
   * @see {@link UserAuthentication.password()} for more information.
   */
  password: () => UserPasswordModifier;
}

/**
 * Hooks user authentication functionality.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link UserAuthentication} for more information
 */
export const AuthContext = createContext<AuthContext | undefined>(undefined);
