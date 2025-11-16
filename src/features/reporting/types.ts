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
   *
   * **The description property must be initialized to publish the report.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param description the given report title
   * @returns a result that validates the given input
   */
  description: (description: string) => Result<this>;

  /**
   * Initializes the link property.
   * If the given link is invalid, the function returns an error.
   *
   * **The link property must be initialized to publish the report.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param link the given report link
   * @returns a result that validates the given input
   */
  link: (link: string) => Result<this>;

  /**
   * Finalizes the reporter and inserts the new user report to the database.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding new user report
   */
  report: (
    target: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserReport, 'id'>;
}
