import { UserAuthentication } from '@shared/api';
import { AuthContext } from '@shared/contexts';
import type { NullableResult, Result } from '@shared/types';
import { empty, ok } from '@shared/utils';
import type { User } from '@supabase/supabase-js';
import {
  type JSX,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

/**
 * The return type for the {@link AuthProvider} component.
 */
interface AuthProvider {
  children: ReactNode;
}

/**
 * Provides user authentication functionality only within the authentication context.
 *
 * @param children the children nodes of the authentication provider
 * @returns the authentication provider
 * @see {@link UserAuthentication} for more information
 * @see {@link AuthContext} for more information
 * @see {@link useAuth()} to use the authentication functionality
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function AuthProvider({ children }: AuthProvider): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<NullableResult<User>>(() => empty());

  /**
   * Hooks the `signup()` functionality.
   *
   * @see {@link UserAuthentication.signup()}
   */
  const signup = () => UserAuthentication.signup();

  /**
   * Hooks the `signin()` functionality.
   *
   * @see {@link UserAuthentication.signin()}
   */
  const signin = () => UserAuthentication.signin();

  /**
   * Hooks the `signout()` functionality.
   *
   * @see {@link UserAuthentication.signout()}
   */
  const signout = async () => UserAuthentication.signout();

  /**
   * Hooks the `resend()` functionality.
   */
  const resend = () => UserAuthentication.resend();

  /**
   * Hooks the `password()` functionality.
   *
   * @see {@link UserAuthentication.password()}
   */
  const password = () => UserAuthentication.password();

  /**
   * Subscribes the authentication provider to user authentication events.
   */
  useEffect(() => {
    const subscription = UserAuthentication.subscribe((_, result) => {
      if (result.ok) {
        setUser(ok(result.data.user));
        setLoading(false);
      } else {
        setUser(result);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        signup,
        signin,
        signout,
        resend,
        password,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
