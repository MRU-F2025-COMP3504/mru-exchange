import type { DatabaseQuery, Result, Review } from '@shared/types';

/**
 * Builds a user review based on the given initialized inputs for selected user review properties.
 * Selection may happen during runtime (e.g., initializing the rating property).
 *
 * @see {@link UserReviewing.create()}
 */
export interface ReviewPublisher {
  /**
   * Initializes the description property.
   * The given description always successfully validates.
   *
   * Initializing the description property is optional.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param description the given user review description
   * @returns a result that validates the given input
   */
  description: (description: string) => Result<this>;

  /**
   * Initializes the description property.
   * If the given rating exceeds the minimum (0) bound, the function returns an error.
   *
   * **The rating property must be initialized to publish the review.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param description the given user review rating
   * @returns a result that validates the given input
   */
  rating: (rating: number) => Result<this>;

  /**
   * Finalizes the builder and inserts the new user review to the database.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding new user review
   */
  publish: () => DatabaseQuery<Review, 'id'>;
}
