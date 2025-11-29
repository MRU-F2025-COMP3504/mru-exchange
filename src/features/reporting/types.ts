import type {
  DatabaseQuery,
  RequireProperty,
  Result,
  UserProfile,
  UserReport,
} from '@shared/types';

/**
 * Builds a user report based on the given initialized inputs for selected user report properties.
 * Selection may happen during runtime (e.g., initializing report link property).
 *
 * @see {@link UserReporting.create()}
 */
export interface UserReporter {
  /**
   * Initializes the description property.
   * If the given description is empty, the function returns an error.
   * By default, the form `key` parameter is `description`.
   *
   * **The description property must be initialized to publish the report.**
   *
   * @param form the given {@link FormData}
   * @param key the given key (`description`) to {@link FormDataEntryValue}
   * @returns a result that validates the given input
   */
  description: (form: FormData, key?: string) => Result<string>;

  /**
   * Initializes the link property.
   * If the given link is invalid, the function returns an error.
   * By default, the form `key` parameter is `link`.
   *
   * **The link property must be initialized to publish the report.**
   *
   * @param form the given {@link FormData}
   * @param key the given key (`link`) to {@link FormDataEntryValue}
   * @returns a result that validates the given input
   */
  link: (form: FormData, key?: string) => Result<string>;

  /**
   * Scans the reporter for any `undefined` required report properties.
   * The {@link isSatisfied()} does not evaluate any form inputs.
   *
   * @returns if the user reporter has all the required properties evaluated
   */
  isSatisfied: () => boolean;

  /**
   * Finalizes the reporter and inserts the new user report to the database.
   *
   * @returns a promise that resolves to the corresponding new user report
   */
  submit: (
    target: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport, 'id'>;
}
