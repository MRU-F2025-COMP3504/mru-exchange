import type {
  PromiseResult,
  RequireProperty,
  Result,
  UserProfile,
} from '@shared/types';
import type { EmailOtpType, MobileOtpType } from '@supabase/supabase-js';

/**
 * Represents the user's credentials for sign-ins, sign-outs, and sign-ups.
 *
 * @see {@link UserAuthentication} for its implementation
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
   * The user's name.
   */
  name: Username;
}

/**
 * Represents the user's name.
 */
export interface Username {
  /**
   * The user's first name.
   */
  first: string;

  /**
   * The user's last name.
   */
  last: string;

  /**
   * The user's name alias or nickname.
   */
  alias: string;
}

/**
 * Sends the user credentials to Supabase.
 *
 * @see {@link UserAuthentication} for its implementation
 */
export interface UserCredentialsSigner {
  /**
   * Scans the signer for any `undefined` required credentials.
   * The {@link isValid()} does not evaluate any form inputs.
   *
   * @returns if the signer has all the required credentials evaluated
   */
  isValid: () => boolean;

  /**
   * Submits the provided credentials to Supabase's authentication system.
   * The finalized version of the user credentials depends on the authentication scenario (e.g.,, sign-in, sign-up).
   * Depending on the usage, the "incomplete" user credentials may be passed in.
   *
   * @returns the {@link Promise} that sucessfully resolves
   */
  submit: () => PromiseResult<null>;
}

/**
 * Builds sign-in user credentials.
 *
 * @see {@link UserAuthentication} for its implementation
 * @see {@link UserCredentialsSigner}
 */
export interface UserSignin extends UserCredentialsSigner {
  /**
   * Initializes the `email` property.
   * If the given email address is invalid, the function returns an error.
   *
   * @param form the given {@link FormData}
   * @param key the given key to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   * @see {@link REGEX_EMAIL}
   */
  email: (form: FormData, key?: string) => Result<string>;

  /**
   * Initializes the `password` property.
   * If the given user password is invalid, the function returns an error.
   *
   * @param form the given {@link FormData}
   * @param key the given key to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  password: (form: FormData, key?: string) => Result<string>;
}

/**
 * Builds sign-up user credentials.
 *
 * @see {@link UserAuthentication} for its implementation
 * @see {@link UserCredentialsSigner}
 */
export interface UserSignup extends UserSignin {
  /**
   * Initializes the `first` and `last` property.
   * If the given full name is invalid, the function returns an error.
   *
   * @param form the given {@link FormData}
   * @param key the given key to three {@link FormDataEntryValue} (i.e., `[firstname, lastname, alias]`)
   * @returns the {@link Result} that validates the given input
   */
  name: (
    form: FormData,
    key?: [string, string, string],
  ) => [Result<string>, Result<string>, Result<string>];
}

/**
 * Re-triggers sign-up verification based on one of the following method (i.e., email or mobile).
 *
 * @see {@link UserAuthentication} for its implementation
 * @see {@link UserSignup}
 */
export interface UserVerificationResender {
  /**
   * Resends the OTP by email verification from user sign-up or email change.
   *
   * @param type the given {@link EmailOtpType} (i.e., `signup` or `email_change`)
   * @param email the given email to re-verify
   * @returns the {@link Promise} that successfully resolves
   */
  email: (
    type: Extract<EmailOtpType, 'signup' | 'email_change'>,
    email: Result<string>,
  ) => PromiseResult<null>;

  /**
   * Resends the OTP by phone change or SMS.
   *
   * @param type the given {@link MobileOtpType} (i.e., `sms` or `phone_change`)
   * @param phone the given phone number to re-send
   * @returns the {@link Promise} that successfully resolves
   */
  mobile: (
    type: Extract<MobileOtpType, 'sms' | 'phone_change'>,
    phone: Result<string>,
  ) => PromiseResult<null>;
}

/**
 * Modifies the user's existing password based on one of the following method (i.e., reset by email or update).
 *
 * @see {@link UserAuthentication} for its implementation
 */
export interface UserPasswordModifier {
  /**
   * Resets the user's password.
   * An email would be sent to the user's email to configure a new password.
   * Used on user sign-in, such as when a user forgets their password.
   *
   * @param email the given user profile (i.e., `email`)
   * @returns the {@link Promise} that successfully resolves
   */
  reset: (email: RequireProperty<UserProfile, 'email'>) => PromiseResult<null>;

  /**
   * Updates the user's password.
   * Unlike the {@link UserPasswordModifier.reset()}, the authenticated user typically changes their password on their profile page.
   *
   * @param form the given {@link FormData}
   * @param key the given key to {@link FormDataEntryValue}
   * @returns the {@link Promise} that successfully resolves
   */
  update: (form: FormData, key: string) => PromiseResult<null>;
}
