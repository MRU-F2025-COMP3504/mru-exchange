import type {
  Category,
  DatabaseQuery,
  Product,
  RequiredColumns,
  Result,
  UserProfile,
} from '@shared/types';

/**
 * Filters products based on the selection of product properties.
 * Selection may happen during runtime (e.g., category selection on search query).
 */
export interface ProductFilter {
  /**
   * Passes the given seller from the filter.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param seller the given user identifier
   * @returns a result that validates the given input
   */
  seller: (seller: RequiredColumns<UserProfile, 'supabase_id'>) => Result<this>;

  /**
   * Passes the given minimum and maximum price value from the filter.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param min the given minimum price amount
   * @param max the given maximum price amount
   * @returns a result that validates the given input
   */
  price: (min: number, max: number) => Result<this>;

  /**
   * Passes the given minimum and maximum stock value from the filter.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param min the given minimum price amount
   * @param max the given maximum price amount
   * @returns a result that validates the given input
   */
  stock: (min: number, max: number) => Result<this>;

  /**
   * Passes the given category tag(s) from the filter.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param categories the given category tag identifier(s)
   * @returns a result that validates the given input
   */
  categories: (categories: RequiredColumns<Category, 'id'>[]) => Result<this>;

  /**
   * Finalizes the filter and queries for matching product(s).
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding product(s) matched from the filter
   */
  find: () => DatabaseQuery<Product[], 'id'>;
}
