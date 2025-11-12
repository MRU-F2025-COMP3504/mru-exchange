import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { type AuthContextType, AuthProvider, useAuth } from '@shared/contexts';
import { ok } from '@shared/utils';
/*import {
  AuthProvider,
  useAuth,
} from '@shared/contexts/auth/AuthContextTest';*/

vi.mock('../../api/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => ok(null)),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resend: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

function getContext(): { current: AuthContextType } {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (<AuthProvider>{children}</AuthProvider>);
  };

  return renderHook(() => useAuth(), { wrapper }).result;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
