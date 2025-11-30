import { describe, it, expect, vi } from 'vitest';
import { UserAuthentication } from '@shared/api';
import { supabase } from '@shared/api';
import type {
  UserCredentialsSigner,
  UserSignin,
  UserSignup,
} from '@shared/types';

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
    validate(UserAuthentication.signin(), new FormData());

    const form = new FormData();
    const signup = UserAuthentication.signup();

    validate(signup, form);

    form.set('firstname', 'John');
    form.set('lastname', '123');
    form.set('alias', '!@#');

    let results = signup.name(form);

    expect(
      results[0].ok && results[1].ok && results[2].ok,
      'name() valid',
    ).toBe(false);

    form.set('firstname', '123');
    form.set('lastname', 'Doe');
    form.set('alias', '123!@#');

    results = signup.name(form);

    expect(
      results[0].ok && results[1].ok && results[2].ok,
      'name() valid',
    ).toBe(false);

    form.set('firstname', '!@#');
    form.set('lastname', '');
    form.set('alias', '');

    results = signup.name(form);

    expect(
      results[0].ok && results[1].ok && results[2].ok,
      'name() valid',
    ).toBe(false);

    form.set('firstname', '');
    form.set('lastname', '!@#');
    form.set('alias', 'abc123!@#');

    results = signup.name(form);

    expect(
      results[0].ok && results[1].ok && results[2].ok,
      'name() valid',
    ).toBe(false);
  });
});

function validate(signer: UserSignin | UserSignup, form: FormData) {
  form.set('email', 'test@gmail.com');

  expect(signer.email(form).ok, 'email() valid').toBe(false);

  form.set('password', '');

  expect(signer.password(form).ok, 'password() valid').toBe(false);

  form.set('password', '123');

  expect(signer.password(form).ok, 'password() valid').toBe(false);

  form.set('password', 'longpassword'.repeat(100));

  expect(signer.password(form).ok, 'password() valid').toBe(false);
}
