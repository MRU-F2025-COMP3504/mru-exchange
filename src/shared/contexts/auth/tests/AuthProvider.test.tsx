import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { type AuthContextType, AuthProvider, useAuth } from '@shared/contexts';
import { supabase } from '@shared/api';

function getContext(): { current: AuthContextType } {
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

  it('loads the client user', async () => {
    const context = getContext();

    await waitFor(() => {
      expect(context.current.loading, 'loading user failed').toBe(false);
    });

    expect(context.current.user.ok, 'user invalid').toBe(true);
  });

  it('throws an error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within the AuthProvider');
  });
});
