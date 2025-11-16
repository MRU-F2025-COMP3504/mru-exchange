import type {
  Result,
  PromiseResult,
  DatabaseQuery,
  UserProfile,
  UserCredentialsValidator,
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

interface UserAuthentication {
  getUser: () => PromiseResult<User>;
  getUserProfile: () => DatabaseQuery<UserProfile, '*'>;
  subscribe: (
    callback: (
      event: AuthChangeEvent,
      session: Result<Session, AuthError>,
    ) => void,
  ) => Subscription;
  modify: () => UserCredentialsValidator;
  signUp: () => UserCredentialsValidator | UserSignUp;
  signIn: () => UserCredentialsValidator | UserSignIn;
  signOut: () => PromiseResult<null>;
}

interface UserSignUp {
  resendEmail: () => PromiseResult<null>;
}

interface UserSignIn {
  resetPassword: () => PromiseResult<null>;
}

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
  modify(): UserCredentialsValidator {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsValidator> {
        return setEmail(this, credentials, email);
      },
      password(password: string): Result<UserCredentialsValidator> {
        return setPassword(this, credentials, password);
      },
      fullname(first: string, last: string): Result<UserCredentialsValidator> {
        return setFullname(this, credentials, first, last);
      },
      username(username: string): Result<UserCredentialsValidator> {
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
  signUp(): UserCredentialsValidator | UserSignUp {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsValidator> {
        return setEmail(this as UserCredentialsValidator, credentials, email);
      },
      password(password: string): Result<UserCredentialsValidator> {
        return setPassword(
          this as UserCredentialsValidator,
          credentials,
          password,
        );
      },
      fullname(first: string, last: string): Result<UserCredentialsValidator> {
        return setFullname(
          this as UserCredentialsValidator,
          credentials,
          first,
          last,
        );
      },
      username(username: string): Result<UserCredentialsValidator> {
        return setUsername(
          this as UserCredentialsValidator,
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
      async resendEmail(): PromiseResult<null> {
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
  signIn(): UserCredentialsValidator | UserSignIn {
    const credentials: Partial<UserCredentials> = {};

    return {
      email(email: string): Result<UserCredentialsValidator> {
        return setEmail(this as UserCredentialsValidator, credentials, email);
      },
      password(password: string): Result<UserCredentialsValidator> {
        if (!password) {
          return err('Password cannot be empty');
        } else {
          credentials.password = password;
        }

        return ok(this as UserCredentialsValidator);
      },
      fullname(): Result<UserCredentialsValidator> {
        return err('Unsupported operation (fullname)');
      },
      username(): Result<UserCredentialsValidator> {
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

function authenticate(response: AuthResponse | UserResponse): Result<User> {
  const { data, error } = response;

  if (error) {
    return err(error);
  } else if (data.user) {
    return ok(data.user);
  }

  return err('Invalid authentication response');
}

function setEmail(
  validator: UserCredentialsValidator,
  credentials: Partial<UserCredentials>,
  email: string,
): Result<UserCredentialsValidator> {
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

function setPassword(
  validator: UserCredentialsValidator,
  credentials: Partial<UserCredentials>,
  password: string,
): Result<UserCredentialsValidator> {
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

function setFullname(
  validator: UserCredentialsValidator,
  credentials: Partial<UserCredentials>,
  first: string,
  last: string,
): Result<UserCredentialsValidator> {
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

function setUsername(
  validator: UserCredentialsValidator,
  credentials: Partial<UserCredentials>,
  username: string,
): Result<UserCredentialsValidator> {
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
