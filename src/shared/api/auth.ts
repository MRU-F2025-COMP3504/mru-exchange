import { supabase } from '@shared/api';
import type {
  PromiseResult,
  RequireProperty,
  Result,
  UserVerificationResender,
  UserCredentials,
  UserPasswordModifier,
  UserProfile,
  UserSignin,
  UserSignup,
} from '@shared/types';
import {
  err,
  ok,
  query,
  REGEX_EMAIL,
  REGEX_LETTERS_ONLY,
  REGEX_USERNAME,
} from '@shared/utils';
import {
  type AuthChangeEvent,
  AuthError,
  type AuthResponse,
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
   * To handle the promise result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
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
    callback: (
      event: AuthChangeEvent,
      session: Result<Session, AuthError>,
    ) => void,
  ) => Subscription;

  /**
   * Registers the user into the website.
   *
   * @see {@link UserSignup} for more information on its builder features
   * @returns the user credentials builder and additional user sign-up features
   */
  signup: () => UserSignup;

  /**
   * Signs the user into the website.
   * The user must be registered in order to sign in.
   * If there are authentication cookies stored, the user signs in automatically without re-typing credentials.
   *
   * @see {@link UserSignin} for more information on its builder features
   * @returns the user credentials builder and additional user sign-in features
   */
  signin: () => UserSignin;

  /**
   * Signs the user out of the website.
   * Invalidates existing authentication cookies.
   *
   * @returns a promise that successfully resolves
   */
  signout: () => PromiseResult<null>;

  /**
   * Modifies the user's password credentials.
   *
   * @see {@link UserPasswordModifier}
   * @returns the user credentials builder
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
    callback: (
      event: AuthChangeEvent,
      session: Result<Session, AuthError>,
    ) => void,
  ): Subscription {
    const subscriber = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        callback(event, ok(session));
      } else {
        callback(
          event,
          err(new AuthError('No session found', 401, 'session_not_found')),
        );
      }
    });

    return subscriber.data.subscription;
  },
  signup(): UserSignup {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<string> {
        return setEmail(credentials, email);
      },
      password(password: string): Result<string> {
        return setPassword(credentials, password);
      },
      fullname(fullname: string[]): Result<string[]> {
        return setFullname(credentials, fullname);
      },
      username(username: string): Result<string> {
        return setUsername(credentials, username);
      },
      async submit(): PromiseResult<User> {
        const submitted = credentials as UserCredentials;

        return authenticate(
          await supabase.auth.signUp({
            email: submitted.email,
            password: submitted.password,
            options: {
              emailRedirectTo: `${window.location.origin}/home`,
              data: {
                first_name: submitted.fullname[0],
                last_name: submitted.fullname[1],
              },
            },
          }),
        );
      },
      resend(): UserVerificationResender {
        return {
          email(
            type: Extract<EmailOtpType, 'signup' | 'email_change'>,
            email: string,
          ): PromiseResult<null> {
            return resend({ type, email });
          },
          mobile(
            type: Extract<MobileOtpType, 'sms' | 'phone_change'>,
            phone: string,
          ): PromiseResult<null> {
            return resend({ type, phone });
          },
        };
      },
    };
  },
  signin(): UserSignin {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<string> {
        return setEmail(credentials, email);
      },
      password(password: string): Result<string> {
        return setPassword(credentials, password);
      },
      async submit(): PromiseResult<User> {
        const submitted = credentials as UserCredentials;

        return authenticate(
          await supabase.auth.signInWithPassword({
            email: submitted.email,
            password: submitted.password,
          }),
        );
      },
    };
  },
  async signout(): PromiseResult<null> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return err(error);
    }

    return ok(null);
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
          return err(error);
        }

        return ok(null);
      },
      async update(
        credentials: RequireProperty<UserCredentials, 'password'>,
      ): PromiseResult<User> {
        const validate = setPassword(credentials, credentials.password);

        if (validate.ok) {
          const password = validate.data;

          const { data, error } = await supabase.auth.updateUser({
            password,
          });

          if (error) {
            return err(error);
          }

          return ok(data.user);
        }

        return validate;
      },
    };
  },
};

async function resend(params: ResendParams): PromiseResult<null> {
  const { error } = await supabase.auth.resend(params);

  if (error) {
    return err(error);
  }

  return ok(null);
}

/**
 * A utility function that wraps the authentication response into a {@link Result}.
 *
 * @internal
 * @param response the authentication response from supabase's authentication system
 * @returns a result that may contain the corresponding user
 * @see {@link Result}
 */
function authenticate(response: AuthResponse): Result<User> {
  const { data, error } = response;

  if (error) {
    return err(error);
  } else if (data.user) {
    return ok(data.user);
  }

  return err('Invalid authentication response');
}

/**
 * A utility function that validates and assigns the given email for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param email the given email to assign
 * @see {@link REGEX_EMAIL}
 */
function setEmail(
  credentials: Partial<UserCredentials>,
  email: string,
): Result<string> {
  const trimmed = email.trim();

  if (!trimmed) {
    return err('Email is empty');
  } else if (!REGEX_EMAIL.test(trimmed)) {
    return err('Only @mtroyal.ca email addresses are allowed');
  } else {
    return ok((credentials.email = trimmed));
  }
}

/**
 * A utility function that validates and assigns the given password for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param password the given password to assign
 */
function setPassword(
  credentials: Partial<UserCredentials>,
  password: string,
): Result<string> {
  if (!password) {
    return err('Password cannot be empty');
  } else if (password.length < 4) {
    return err('Password must have 4 characters or more');
  } else if (password.length > 128) {
    return err('Password must be no more than 128 characters');
  } else {
    return ok((credentials.password = password));
  }
}

/**
 * A utility function that validates and assigns the given user's full name for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param fullname the given first and last name to assign
 * @see {@link REGEX_LETTERS_ONLY}
 */
function setFullname(
  credentials: Partial<UserCredentials>,
  [first, last]: string[],
): Result<string[]> {
  const tfirst = first.trim();
  const tlast = last.trim();

  if (!tfirst) {
    return err('First name cannot be empty');
  } else if (!tlast) {
    return err('Last name cannot be empty');
  } else if (!REGEX_LETTERS_ONLY.test(tfirst)) {
    return err('Invalid first name');
  } else if (!REGEX_LETTERS_ONLY.test(tlast)) {
    return err('Invalid last name');
  } else {
    return ok((credentials.fullname = [tfirst, tlast]));
  }
}

/**
 * A utility function that validates and assigns the given username for the user's credentials.
 *
 * @internal
 * @param credentials the given incomplete user credentials
 * @param username the given username to assign
 * @see {@link REGEX_USERNAME}
 */
function setUsername(
  credentials: Partial<UserCredentials>,
  username: string,
): Result<string> {
  const trimmed = username.trim();

  if (!trimmed) {
    return err('Username cannot be empty');
  } else if (!REGEX_USERNAME.test(trimmed)) {
    return err('Invalid username');
  } else {
    return ok((credentials.username = username));
  }
}
