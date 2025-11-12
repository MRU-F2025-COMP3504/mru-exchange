import {
  type ReactNode,
  type JSX,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from '@shared/contexts';
import type { Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { empty, HookUtils, ok } from '@shared/utils';
import { AuthAPI } from '@shared/api';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Result<User>>(() => empty());

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      return AuthAPI.signUp(email, password, firstName, lastName);
    },
    [],
  );
  const signIn = useCallback(async (email: string, password: string) => {
    return AuthAPI.signIn(email, password);
  }, []);
  const signOut = useCallback(async () => {
    return AuthAPI.signOut();
  }, []);
  const resendEmailVerification = useCallback(async (email: string) => {
    return AuthAPI.resendEmailVerification(email);
  }, []);
  const resetPassword = useCallback(async (email: string) => {
    return AuthAPI.resetPassword(email);
  }, []);
  const updatePassword = useCallback(async (password: string) => {
    return AuthAPI.updatePassword(password);
  }, []);

  useEffect(() => {
    void HookUtils.load(setLoading, AuthAPI.getUser()).then(setUser);

    const subscription = AuthAPI.onAuthStateChange((_event, result) => {
      if (result.ok) {
        setUser(ok(result.data.user));
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
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resendEmailVerification,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
