import type { PromiseResult, Result } from '@shared/types';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@shared/types';

/**
 * Represents the user's credentials for sign-ins, sign-outs, and sign-ups.
 *
 * @see {@link UserAuthentication}
 */
export interface UserCredentials {
  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's unencrypted password.
   */
  password: string;

  /**
   * The user's first name.
   */
  firstName: string;

  /**
   * The user's last name.
   */
  lastName: string;

  /**
   * The user's username/nickname.
   */
  username: string;
}

/**
 * Builds user credentials based on the given initialized inputs for selected user credential properties.
 * These properties depend on the use-case of user authentication; all properties are optional.
 *
 * @see {@link UserAuthentication}
 */
export interface UserCredentialsBuilder {
  /**
   * Initializes the `email` property.
   * If the given email address is invalid, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param email the given email address
   * @returns a result that validates the given input
   * @see {@link REGEX_EMAIL}
   */
  email: (email: string) => Result<this>;

  /**
   * Initializes the `password` property.
   * If the given user password is invalid, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param password the given user password
   * @returns a result that validates the given input
   */
  password: (password: string) => Result<this>;

  /**
   * Initializes the `first` and `last` property.
   * If the given full name is invalid, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param first the given first name
   * @param last the given last name
   * @returns a result that validates the given input
   */
  fullname: (first: string, last: string) => Result<this>;

  /**
   * Initializes the `username` property.
   * If the given username is invalid, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param username the given username
   * @returns a result that validates the given input
   */
  username: (username: string) => Result<this>;

  /**
   * Finalizes the builder and submits the provided credentials to Supabase's authentication system.
   *
   * To handle the promise result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding user
   */
  submit: () => PromiseResult<User | UserProfile>;
}
