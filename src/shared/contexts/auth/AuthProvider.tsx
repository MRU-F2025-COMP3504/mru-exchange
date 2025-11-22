import { type ReactNode, type JSX, useEffect, useState } from 'react';
import { AuthContext } from '@shared/contexts';
import type { Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { empty, HookUtils, ok } from '@shared/utils';
import { UserAuthentication } from '@shared/api';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Result<User>>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, UserAuthentication.getUser()).then(setUser);

    const subscription = UserAuthentication.subscribe((_event, result) => {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
