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
   * By default, the form `key` parameter is `description`.
   *
   * Initializing the description property is optional.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`description`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  description: (form: FormData, key?: string) => Result<string>;

  /**
   * Initializes the description property.
   * If the given rating exceeds the minimum (0) bound, the function returns an error.
   * By default, the form `key` parameter is `rating`.
   *
   * **The rating property must be initialized to publish the review.**
   *
   * @param form the given {@link FormData}
   * @param key the given key (`rating`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  rating: (form: FormData, key?: string) => Result<number>;

  /**
   * Scans the publisher for any `undefined` required review properties.
   * The {@link isSatisfied()} does not evaluate any form inputs.
   *
   * @returns if the review publisher has all the required properties evaluated
   */
  isSatisfied: () => boolean;

  /**
   * Finalizes the builder and inserts the new user review to the database.
   *
   * @returns the {@link Promise} that resolves to the corresponding new user review
   */
  submit: () => DatabaseQuery<Review, '*'>;
}
