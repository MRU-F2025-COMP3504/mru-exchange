import type {
  NullableResult,
  PromiseResult,
  UserPasswordModifier,
  UserProfile,
  UserSignin,
  UserSignup,
  UserVerificationResender,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

/**
 * Represents the authentication context.
 *
 * @see {@link AuthProvider} for its implementation
 */
export interface AuthContext {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current user result state.
   */
  user: NullableResult<User>;

  /**
   * @see {@link UserAuthentication.signup()}
   */
  signup: () => UserSignup;

  /**
   * @see {@link UserAuthentication.signin()}
   */
  signin: () => UserSignin;

  /**
   * @see {@link UserAuthentication.signout()}
   */
  signout: () => PromiseResult<null>;

  /**
   * @see {@link UserAuthentication.resend()}
   */
  resend: () => UserVerificationResender;

  /**
   * @see {@link UserAuthentication.password()}
   */
  password: () => UserPasswordModifier;
}

/**
 * Hooks user authentication functionality.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link UserAuthentication}
 */
export const AuthContext = createContext<AuthContext | undefined>(undefined);
