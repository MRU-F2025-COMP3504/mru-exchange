import {
  type ReactNode,
  type JSX,
  useCallback,
  useEffect,
  useState,
  createContext,
} from 'react';
import type { Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { empty, HookUtils, ok } from '@shared/utils';
import { AuthAPI } from '@features/auth';
import type { AuthPromiseResult, UserSession } from '@features/auth/types';

interface AuthContextType {
  user: Result<User>;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => AuthPromiseResult<UserSession>;
  signIn: (email: string, password: string) => AuthPromiseResult<UserSession>;
  signOut: () => AuthPromiseResult<null>;
  resendEmailVerification: (email: string) => AuthPromiseResult<null>;
  resetPassword: (email: string) => AuthPromiseResult<null>;
  updatePassword: (password: string) => AuthPromiseResult<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Result<User>>(() => empty());

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    return AuthAPI.signUp(email, password, firstName, lastName);
  }, []);
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