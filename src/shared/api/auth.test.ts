import { describe, it, expect, vi } from 'vitest';
import { UserAuthentication } from '@shared/api';
import { supabase } from '@shared/api';
import type { UserCredentialsBuilder } from '@shared/types';

describe('User Authentication', () => {
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

  it('should reject non-mtroyal.ca emails on sign up/in', () => {
    validate(UserAuthentication.signUp());
    validate(UserAuthentication.signIn());
  });
});

function validate(builder: UserCredentialsBuilder) {
  expect(builder.email('test@gmail.com').ok, 'email() valid').toBe(false);
  expect(builder.password('').ok, 'password() valid').toBe(false);
  expect(builder.password('123').ok, 'password() valid').toBe(false);
  expect(
    builder.password('longpassword'.repeat(100)).ok,
    'password() valid',
  ).toBe(false);
  expect(builder.fullname('John', '123').ok, 'fullname() valid').toBe(false);
  expect(builder.fullname('123', 'Doe').ok, 'fullname() valid').toBe(false);
  expect(builder.fullname('!@#', '').ok, 'fullname() valid').toBe(false);
  expect(builder.fullname('', '!@#').ok, 'fullname() valid').toBe(false);
  expect(builder.fullname('', '').ok, 'fullname() valid').toBe(false);
}
