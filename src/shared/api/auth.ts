import type {
  Result,
  PromiseResult,
  DatabaseQuery,
  UserProfile,
  UserCredentialsBuilder,
  UserCredentials,
} from '@shared/types';
import {
  query,
  err,
  ok,
  REGEX_EMAIL,
  REGEX_LETTERS_ONLY,
  REGEX_USERNAME,
} from '@shared/utils';
import {
  type User,
  type AuthChangeEvent,
  AuthError,
  type Subscription,
  type AuthResponse,
  type UserResponse,
  type Session,
} from '@supabase/supabase-js';
import { supabase } from '@shared/api';

/**
 * See the implementation below for more information.
 */
interface UserAuthentication {
  /**
   * Retrieves the current logged-in supabase {@link User}.
   * The {@link User} contains information relevant for authentication.
   *
   * **This does not primarily pertain to the website user experience.**
   *
   * To handle the promise result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @see {@link UserAuthentication.getUserProfile()} for retrieving general user information
   * @returns a promise that resolves to the corresponding supabase user
   */
  getUser: () => PromiseResult<User>;

  /**
   * Retrieves the current logged-in user.
   * The {@link UserProfile} contains information relevant for website user experience.
   *
   * To handle the promise result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @see {@link UserAuthentication.getUser()} for retrieving user authentication-relevant information
   * @returns a promise that resolves to the corresponding user profile
   */
  getUserProfile: () => DatabaseQuery<UserProfile, '*'>;

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
   * Modifies the user's credentials.
   *
   * @see {@link UserCredentialsBuilder} for more information on its builder features
   * @returns the user credentials validator
   */
  modify: () => UserCredentialsBuilder;

  /**
   * Registers the user into the website.
   *
   * @see {@link UserCredentialsBuilder} for more information on its builder features
   * @see {@link UserSignUp} for more information on its builder features
   * @returns the user credentials validator and additional user sign-up features
   */
  signUp: () => UserCredentialsBuilder | UserSignUp;

  /**
   * Signs the user into the website.
   * The user must be registered in order to sign in.
   * If there are authentication cookies stored, the user signs in automatically without re-typing credentials.
   *
   * @see {@link UserCredentialsBuilder} for more information on its builder features
   * @see {@link UserSignIn} for more information on its builder features
   * @returns the user credentials validator and additional user sign-in features
   */
  signIn: () => UserCredentialsBuilder | UserSignIn;

  /**
   * Signs the user out of the website.
   * Invalidates existing authentication cookies.
   *
   * @see {@link UserCredentialsBuilder} for more information on its builder features
   * @returns the user credentials validator
   */
  signOut: () => PromiseResult<null>;
}

/**
 * See the implementation below for more information.
 */
interface UserSignUp {
  /**
   * Resends email verification on the sign-up page.
   *
   * @returns a promise that resolves when resending the verification is successful
   */
  reverify: () => PromiseResult<null>;
}

/**
 * See the implementation below for more information.
 */
interface UserSignIn {
  /**
   * Resets the user's password on the sign-in page.
   */
  resetPassword: () => PromiseResult<null>;
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
  async getUser(): PromiseResult<User> {
    return authenticate(await supabase.auth.getUser());
  },
  async getUserProfile(): DatabaseQuery<UserProfile, '*'> {
    const user = await UserAuthentication.getUser();

    if (user.ok) {
      return query(
        await supabase
          .from('User_Information')
          .select('*')
          .eq('supabase_id', user.data.id)
          .single(),
      );
    }

    return user;
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
  modify(): UserCredentialsBuilder {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsBuilder> {
        return setEmail(this, credentials, email);
      },
      password(password: string): Result<UserCredentialsBuilder> {
        return setPassword(this, credentials, password);
      },
      fullname(first: string, last: string): Result<UserCredentialsBuilder> {
        return setFullname(this, credentials, first, last);
      },
      username(username: string): Result<UserCredentialsBuilder> {
        return setUsername(this, credentials, username);
      },
      async submit(): PromiseResult<User | UserProfile> {
        if (credentials.email || credentials.password) {
          return authenticate(
            await supabase.auth.updateUser({ ...credentials }),
          );
        }

        return query(
          await supabase
            .from('User_Information')
            .update({ ...credentials })
            .select('id')
            .single(),
        );
      },
    };
  },
  signUp(): UserCredentialsBuilder | UserSignUp {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsBuilder> {
        return setEmail(this as UserCredentialsBuilder, credentials, email);
      },
      password(password: string): Result<UserCredentialsBuilder> {
        return setPassword(
          this as UserCredentialsBuilder,
          credentials,
          password,
        );
      },
      fullname(first: string, last: string): Result<UserCredentialsBuilder> {
        return setFullname(
          this as UserCredentialsBuilder,
          credentials,
          first,
          last,
        );
      },
      username(username: string): Result<UserCredentialsBuilder> {
        return setUsername(
          this as UserCredentialsBuilder,
          credentials,
          username,
        );
      },
      async submit(): PromiseResult<User | UserProfile> {
        if (!credentials.email || !credentials.password) {
          return err(
            new Error('Invalid email or password', { cause: credentials }),
          );
        }

        return authenticate(
          await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              emailRedirectTo: `${window.location.origin}/home`,
              data: {
                first_name: credentials.firstName,
                last_name: credentials.lastName,
              },
            },
          }),
        );
      },
      async reverify(): PromiseResult<null> {
        if (!credentials.email) {
          return err('Invalid email');
        }

        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: credentials.email,
        });

        if (error) {
          return err(error);
        }

        return ok(null);
      },
    };
  },
  signIn(): UserCredentialsBuilder | UserSignIn {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsBuilder> {
        return setEmail(this as UserCredentialsBuilder, credentials, email);
      },
      password(password: string): Result<UserCredentialsBuilder> {
        if (!password) {
          return err('Password cannot be empty');
        } else {
          credentials.password = password;
        }

        return ok(this as UserCredentialsBuilder);
      },
      fullname(): Result<UserCredentialsBuilder> {
        return err('Unsupported operation (fullname)');
      },
      username(): Result<UserCredentialsBuilder> {
        return err('Unsupported operation (username)');
      },
      async submit(): PromiseResult<User | UserProfile> {
        if (credentials.email || credentials.password) {
          return authenticate(
            await supabase.auth.updateUser({ ...credentials }),
          );
        }

        return query(
          await supabase
            .from('User_Information')
            .update({
              email: credentials.email,
              user_name: credentials.username,
              first_name: credentials.firstName,
              last_name: credentials.lastName,
            })
            .select('*')
            .single(),
        );
      },
      async resetPassword(): PromiseResult<null> {
        if (!credentials.email) {
          return err('Invalid email');
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
          credentials.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          },
        );

        if (error) {
          return err(error);
        }

        return ok(null);
      },
    };
  },
  async signOut(): PromiseResult<null> {
    const response = await supabase.auth.signOut();

    if (response.error) {
      return err(response.error);
    }

    return ok(null);
  },
};

/**
 * A utility function that wraps the authentication/user response into a {@link Result}.
 *
 * @internal
 * @param response the authentication or user response via supabase's authentication system
 * @returns the wrapped result that may contain the corresponding user
 * @see {@link Result}
 */
function authenticate(response: AuthResponse | UserResponse): Result<User> {
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
 * @param validator the given user credentials validator
 * @param credentials the given incomplete user credentials
 * @param email the given email to assign
 * @see {@link REGEX_EMAIL}
 */
function setEmail(
  validator: UserCredentialsBuilder,
  credentials: Partial<UserCredentials>,
  email: string,
): Result<UserCredentialsBuilder> {
  const trimmed = email.trim();

  if (!trimmed) {
    return err('Email is empty');
  } else if (!REGEX_EMAIL.test(trimmed)) {
    return err('Only @mtroyal.ca email addresses are allowed');
  } else {
    credentials.email = trimmed;
  }

  return ok(validator);
}

/**
 * A utility function that validates and assigns the given password for the user's credentials.
 *
 * @internal
 * @param validator the given user credentials validator
 * @param credentials the given incomplete user credentials
 * @param password the given password to assign
 */
function setPassword(
  validator: UserCredentialsBuilder,
  credentials: Partial<UserCredentials>,
  password: string,
): Result<UserCredentialsBuilder> {
  if (!password) {
    return err('Password cannot be empty');
  } else if (password.length < 8) {
    return err('Password must have 8 characters or more');
  } else if (password.length > 128) {
    return err('Password must be no more than 128 characters');
  } else {
    credentials.password = password;
  }

  return ok(validator);
}

/**
 * A utility function that validates and assigns the given user's full name for the user's credentials.
 *
 * @internal
 * @param validator the given user credentials validator
 * @param credentials the given incomplete user credentials
 * @param first the given first name to assign
 * @param last the given last name to assign
 * @see {@link REGEX_LETTERS_ONLY}
 */
function setFullname(
  validator: UserCredentialsBuilder,
  credentials: Partial<UserCredentials>,
  first: string,
  last: string,
): Result<UserCredentialsBuilder> {
  const trimmedFirst = first.trim();
  const trimmedLast = last.trim();

  if (!trimmedFirst) {
    return err('First name cannot be empty');
  } else if (!trimmedLast) {
    return err('Last name cannot be empty');
  } else if (!REGEX_LETTERS_ONLY.test(trimmedFirst)) {
    return err('Invalid first name');
  } else if (!REGEX_LETTERS_ONLY.test(trimmedLast)) {
    return err('Invalid last name');
  } else {
    credentials.firstName = trimmedFirst;
    credentials.lastName = trimmedFirst;
  }

  return ok(validator);
}

/**
 * A utility function that validates and assigns the given username for the user's credentials.
 *
 * @internal
 * @param validator the given user credentials validator
 * @param credentials the given incomplete user credentials
 * @param username the given username to assign
 * @see {@link REGEX_USERNAME}
 */
function setUsername(
  validator: UserCredentialsBuilder,
  credentials: Partial<UserCredentials>,
  username: string,
): Result<UserCredentialsBuilder> {
  const trimmed = username.trim();

  if (!trimmed) {
    return err('Username cannot be empty');
  } else if (!REGEX_USERNAME.test(trimmed)) {
    return err('Invalid username');
  } else {
    credentials.username = username;
  }

  return ok(validator);
}
