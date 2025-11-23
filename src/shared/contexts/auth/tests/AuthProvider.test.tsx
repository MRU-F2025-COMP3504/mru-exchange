import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { type AuthContext, AuthProvider, useAuth } from '@shared/contexts';
import { supabase } from '@shared/api';

function getContext(): { current: AuthContext } {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
  };

  return renderHook(() => useAuth(), { wrapper }).result;
}

describe('AuthContext', () => {
  vi.spyOn(supabase, 'auth', 'get').mockReturnValue({
    getUser: vi
      .fn()
      .mockReturnValue({ data: { user: 'success' }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    }),
  } as never);

  it('loads the client user', () => {
    const context = getContext();

    expect(context.current.user.ok, 'user invalid').toBe(true);
  });

  it('throws an error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within the AuthProvider');
  });
});
