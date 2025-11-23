import type {
  PromiseResult,
  RequireProperty,
  Result,
  UserProfile,
} from '@shared/types';
import type { EmailOtpType, MobileOtpType, User } from '@supabase/supabase-js';

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
   * The user's full name.
   */
  fullname: string[];

  /**
   * The user's username/nickname.
   */
  username: string;
}

/**
 * Sends the user credentials to Supabase.
 *
 * @see {@link UserAuthentication}
 */
export interface UserCredentialsSigner {
  /**
   * Finalizes the builder and submits the provided credentials to Supabase's authentication system.
   * The finalized version of the user credentials depends on the authentication scenario (e.g.,, sign-in, sign-up).
   * Depending on the usage, the "incomplete" user credentials may be passed in.
   *
   * @returns a promise that resolves to the corresponding user
   */
  submit: () => PromiseResult<User>;
}

/**
 * Builds sign-in user credentials.
 *
 * @see {@link UserAuthentication}
 * @see {@link UserCredentialsSigner}
 */
export interface UserSignin extends UserCredentialsSigner {
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
  email: (email: string) => Result<string>;

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
  password: (password: string) => Result<string>;
}

/**
 * Builds sign-up user credentials.
 *
 * @see {@link UserAuthentication}
 * @see {@link UserCredentialsSigner}
 */
export interface UserSignup extends UserSignin {
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
  fullname: ([first, last]: string[]) => Result<string[]>;

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
  username: (username: string) => Result<string>;

  /**
   * Resends the email verification or OTP.
   *
   * @returns the verification resender
   * @see {@link UserVerificationResender}
   * @see {@link GoTrueClient.resend()}
   */
  resend(): UserVerificationResender;
}

/**
 * Re-triggers sign-up verification based on one of the following method (i.e., email or mobile).
 *
 * @see {@link UserAuthentication}
 * @see {@link UserSignup}
 */
export interface UserVerificationResender {
  /**
   * Resends the OTP by email verification from user sign-up or email change.
   *
   * @param type the given {@link EmailOtpType} (i.e., `signup` or `email_change`)
   * @param email the given email to re-verify
   * @returns a promise that successfully resolves
   */
  email: (
    type: Extract<EmailOtpType, 'signup' | 'email_change'>,
    email: string,
  ) => PromiseResult<null>;

  /**
   * Resends the OTP by phone change or SMS.
   *
   * @param type the given {@link MobileOtpType} (i.e., `sms` or `phone_change`)
   * @param phone the given phone number to re-send
   * @returns a promise that successfully resolves
   */
  mobile: (
    type: Extract<MobileOtpType, 'sms' | 'phone_change'>,
    phone: string,
  ) => PromiseResult<null>;
}

/**
 * Modifies the user's existing password based on one of the following method (i.e., reset by email or update).
 *
 * @see {@link UserAuthentication}
 */
export interface UserPasswordModifier {
  /**
   * Resets the user's password.
   * An email would be sent to the user's email to configure a new password.
   * Used on user sign-in, such as when a user forgets their password.
   *
   * @param email the given user profile (i.e., `email`)
   * @returns a promise that successfully resolves
   */
  reset: (email: RequireProperty<UserProfile, 'email'>) => PromiseResult<null>;

  /**
   * Updates the user's password.
   * Unlike the {@link UserPasswordModifier.reset()}, the authenticated user typically changes their password on their profile page.
   *
   * @param credentials the given user credentials (i.e., `password`)
   * @returns a promise that resolves to the corresponding user
   */
  update: (
    credentials: RequireProperty<UserCredentials, 'password'>,
  ) => PromiseResult<User>;
}
