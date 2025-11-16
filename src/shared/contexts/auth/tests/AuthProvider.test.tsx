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
    getUser: vi.fn().mockReturnValue({ data: {}, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resend: vi.fn(),
  } as never);
  vi.spyOn(supabase, 'from').mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockReturnValue({ data: {}, error: null }),
      }),
    }),
  } as never);

  it('should initially set loading to true', () => {
    expect(getContext().current.loading).toBe(true);
  });

  it('should have signUp function', () => {
    expect(typeof getContext().current.signUp).toBe('function');
  });

  it('should have signIn function', () => {
    expect(typeof getContext().current.signIn).toBe('function');
  });

  it('should have signOut function', () => {
    expect(typeof getContext().current.signOut).toBe('function');
  });

  it('should reject non-mtroyal.ca emails on signUp', async () => {
    const context = getContext();

    await waitFor(() => {
      expect(context.current.loading).toBe(false);
    });

    const result = await context.current.signUp(
      'test@gmail.com',
      'password123',
      'John',
      'Doe',
    );

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.message).toContain('@mtroyal.ca');
  });

  it('should reject non-mtroyal.ca emails on signIn', async () => {
    const context = getContext();

    await waitFor(() => {
      expect(context.current.loading).toBe(false);
    });

    const result = await context.current.signIn(
      'test@gmail.com',
      'password123',
    );

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.message).toContain('@mtroyal.ca');
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within the AuthProvider');
  });
});
