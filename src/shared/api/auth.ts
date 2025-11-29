import { supabase } from '@shared/api';
import type {
  PromiseResult,
  RequireProperty,
  Result,
  UserCredentials,
  UserPasswordModifier,
  UserProfile,
  UserSignin,
  UserSignup,
  UserVerificationResender,
} from '@shared/types';
import {
  err,
  FormUtils,
  ok,
  query,
  REGEX_EMAIL,
  REGEX_LETTER_NUMBERS_ONLY,
  REGEX_LETTERS_ONLY,
} from '@shared/utils';
import {
  type AuthChangeEvent,
  type EmailOtpType,
  type MobileOtpType,
  type ResendParams,
  type Session,
  type Subscription,
  type User,
} from '@supabase/supabase-js';

/**
 * See the implementation below for more information.
 */
interface UserAuthentication {
  /**
   * Retrieves the given user.
   *
   * @param the given user identifier
   * @returns a promise that resolves to the corresponding user profile
   */
  getUserProfile: (
    user: RequireProperty<User, 'id'>,
  ) => PromiseResult<UserProfile>;

  /**
   * Subscribes to {@link AuthChangeEvent} for the user.
   *
   * @param callback the event callback to run per event trigger
   * @returns the subscription for the {@link AuthChangeEvent}
   */
  subscribe: (
    callback: (event: AuthChangeEvent, session: Result<Session>) => void,
  ) => Subscription;

  /**
   * Registers the user into the website.
   *
   * @see {@link UserSignup}
   * @returns the user credentials builder and additional user sign-up features
   */
  signup: () => UserSignup;

  /**
   * Signs the user into the website.
   * The user must be registered in order to sign in.
   *
   * @see {@link UserSignin}
   * @returns the user credentials builder and additional user sign-in features
   */
  signin: () => UserSignin;

  /**
   * Signs the user out of the website.
   *
   * @returns a promise that successfully resolves
   */
  signout: () => PromiseResult<null>;

  /**
   * Resends the email verification or OTP.
   *
   * @returns the verification resender
   * @see {@link UserVerificationResender}
   * @see {@link GoTrueClient.resend()} for the underlying supabase implementation
   */
  resend(): UserVerificationResender;

  /**
   * Modifies the user's password credentials.
   *
   * @see {@link UserPasswordModifier}
   * @returns the user password modifier
   */
  password: () => UserPasswordModifier;
}

/**
 * The user authentication feature is used to register, sign-in, and sign-out from the website.
 * - Users require a `@mtroyal.ca` (i.e., the school email domain) to authenticate and access website services.
 * - The feature will make use of authentication cookies to automate signing in.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
export const UserAuthentication: UserAuthentication = {
  async getUserProfile(
    user: RequireProperty<User, 'id'>,
  ): PromiseResult<UserProfile> {
    return query(
      await supabase
        .from('User_Information')
        .select('*')
        .eq('supabase_id', user.id)
        .single(),
    );
  },
  subscribe(
    callback: (event: AuthChangeEvent, session: Result<Session>) => void,
  ): Subscription {
    const subscriber = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        callback(event, ok(session));
      } else {
        callback(event, err('No user session found', { event, session }));
      }
    });

    return subscriber.data.subscription;
  },
  signup(): UserSignup {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(form: FormData, key = 'email'): Result<string> {
        return setEmail(credentials, form, key);
      },
      password(form: FormData, key = 'password'): Result<string> {
        return setPassword(credentials, form, key);
      },
      name(
        form: FormData,
        key = ['firstname', 'lastname', 'alias'],
      ): [Result<string>, Result<string>, Result<string>] {
        return setName(credentials, form, key);
      },
      isSatisfied(): boolean {
        if (!credentials.email) {
          return false;
        } else if (!credentials.password) {
          return false;
        } else if (!credentials.name) {
          return false;
        }

        return true;
      },
      async submit(): PromiseResult<null> {
        const { email, password, name } = credentials as UserCredentials;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: {
              first_name: name.first,
              last_name: name.last,
              user_name: name.alias,
            },
          },
        });

        if (error) {
          return err('Unable to create the account. Please try again.');
        } else {
          return ok(null);
        }
      },
    };
  },
  signin(): UserSignin {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(form: FormData, key = 'email'): Result<string> {
        return setEmail(credentials, form, key);
      },
      password(form: FormData, key = 'password'): Result<string> {
        return setPassword(credentials, form, key);
      },
      isSatisfied(): boolean {
        if (!credentials.email) {
          return false;
        } else if (!credentials.password) {
          return false;
        }

        return true;
      },
      async submit(): PromiseResult<null> {
        const { email, password } = credentials as UserCredentials;
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return err('Invalid email or password', error);
        } else {
          return ok(null);
        }
      },
    };
  },
  async signout(): PromiseResult<null> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return err('Ungraceful sign-out', error);
    } else {
      return ok(null);
    }
  },
  resend(): UserVerificationResender {
    return {
      async email(
        type: Extract<EmailOtpType, 'signup' | 'email_change'>,
        email: Result<string>,
      ): PromiseResult<null> {
        if (email.ok) {
          return resend({ type, email: email.data });
        } else {
          return email;
        }
      },
      async mobile(
        type: Extract<MobileOtpType, 'sms' | 'phone_change'>,
        phone: Result<string>,
      ): PromiseResult<null> {
        if (phone.ok) {
          return resend({ type, phone: phone.data });
        } else {
          return phone;
        }
      },
    };
  },
  password(): UserPasswordModifier {
    return {
      async reset(
        user: RequireProperty<UserProfile, 'email'>,
      ): PromiseResult<null> {
        const { error } = await supabase.auth.resetPasswordForEmail(
          user.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          },
        );

        if (error) {
          return err('Failed to send reset password email', error);
        } else {
          return ok(null);
        }
      },
      async update(form: FormData, key: string): PromiseResult<null> {
        const validate = setPassword({}, form, key);

        if (validate.ok) {
          const password = validate.data;

          const { error } = await supabase.auth.updateUser({
            password,
          });

          if (error) {
            return err('Failed to update the password', error);
          } else {
            return ok(null);
          }
        }

        return validate;
      },
    };
  },
};

/**
 * Resends the given email or phone verification.
 *
 * @internal
 * @param params the {@link ResendParams} for email or phone re-verification
 * @returns the {@link Promise} that successfully resolves
 */
async function resend(params: ResendParams): PromiseResult<null> {
  const { error } = await supabase.auth.resend(params);

  if (error) {
    return err('Failed to resend verification', error);
  } else {
    return ok(null);
  }
}

/**
 * A utility function that validates and assigns the given email for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the wrapped {@link Result} of the corresponding given email
 * @see {@link REGEX_EMAIL}
 */
function setEmail(
  credentials: Partial<UserCredentials>,
  form: FormData,
  key: string,
): Result<string> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid email', error);
  } else if (!data) {
    return err('Email is empty');
  } else if (!REGEX_EMAIL.test(data)) {
    return err('Only @mtroyal.ca email addresses are allowed', data);
  } else {
    return ok((credentials.email = data));
  }
}

/**
 * A utility function that validates and assigns the given password for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the wrapped {@link Result} of the corresponding given password
 */
function setPassword(
  credentials: Partial<UserCredentials>,
  form: FormData,
  key: string,
): Result<string> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid password', error);
  } else if (!data) {
    return err('Password cannot be empty');
  } else if (data.length < 4) {
    return err('Password must have 4 characters or more', data);
  } else if (data.length > 128) {
    return err('Password must be no more than 128 characters', data);
  } else {
    return ok((credentials.password = data));
  }
}

/**
 * A utility function that validates and assigns the given user's full name for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param form the given {@link FormData}
 * @param key the given key to three {@link FormDataEntryValue} (i.e., `[firstname, lastname, alias]`)
 * @returns the wrapped {@link Result} of the corresponding given full name
 * @see {@link REGEX_LETTERS_ONLY}
 */
function setName(
  credentials: Partial<UserCredentials>,
  form: FormData,
  key: [string, string, string],
): [Result<string>, Result<string>, Result<string>] {
  const first: () => Result<string> = () => {
    const { data, error } = FormUtils.getString(form, key[0]);

    if (error) {
      return err('Invalid first name', error);
    } else if (!data) {
      return err('First name cannot be empty');
    } else if (!REGEX_LETTERS_ONLY.test(data)) {
      return err('First name cannot have non-letters', data);
    } else {
      return ok(data);
    }
  };

  const last: () => Result<string> = () => {
    const { data, error } = FormUtils.getString(form, key[1]);

    if (error) {
      return err('Invalid last name', error);
    } else if (!data) {
      return err('Last name cannot be empty');
    } else if (!REGEX_LETTERS_ONLY.test(data)) {
      return err('Last name cannot have non-letters', data);
    } else {
      return ok(data);
    }
  };

  const alias: () => Result<string> = () => {
    const { data, error } = FormUtils.getString(form, key[2]);

    if (error) {
      return err('Invalid alias', error);
    } else if (!data) {
      return err('Alias cannot be empty');
    } else if (!REGEX_LETTER_NUMBERS_ONLY.test(data)) {
      return err('Alias cannot have in-between spaces', data);
    } else {
      return ok(data);
    }
  };

  const name: [Result<string>, Result<string>, Result<string>] = [
    first(),
    last(),
    alias(),
  ];

  const [firstName, lastName, aliasName] = name;

  if (firstName.ok && lastName.ok && aliasName.ok) {
    credentials.name = {
      first: firstName.data,
      last: firstName.data,
      alias: aliasName.data,
    };
  }

  return name;
}
