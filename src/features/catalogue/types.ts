import type {
  DatabaseQuery,
  NumberRange,
  Product,
  RequireProperty,
  Result,
  UserProfile,
} from '@shared/types';

/**
 * Represents the product filter.
 */
export interface ProductFilter {
  /**
   * The seller's authentication identifier.
   */
  seller: string;

  /**
   * The category tag identifiers.
   */
  categories: number[];

  /**
   * The minimum and maximum price amount, respectively.
   */
  price: NumberRange;

  /**
   * The minimum ([0]) and maximum stock ([1]) amount, respectively,
   */
  stock: NumberRange;
}

/**
 * Filters products based on the selection of product properties.
 * Selection may happen during runtime (e.g., category selection on search query).
 *
 * @see {@link ProductCategory.getByFilter()}
 * @see {@link useProductFilter()}
 */
export interface ProductFilterBuilder {
  /**
   * Passes the given seller from the filter.
   * If the given seller does not have a `supabase_id` property, the function returns an error.
   *
   * @param seller the given user identifier
   * @returns the {@link Result} that validates the given input
   */
  seller: (
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ) => Result<string>;

  /**
   * Passes the given minimum and maximum price value from the filter.
   * If the given price values exceeds the minimum (0) bounds, the function returns an error.
   * By default, the form `key` paramater is `['min-price', 'max-price']`.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`min-price` and `max-price`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  price: (
    form: FormData,
    key?: [string, string],
  ) => [Result<number>, Result<number>];

  /**
   * Passes the given minimum and maximum stock value from the filter.
   * If the given stock values exceeds the minimum (0) bounds, the function returns an error.
   * By default, the form 'key' parameter is `['min-stock', 'max-stock']`.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`stock`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  stock: (
    form: FormData,
    key?: [string, string],
  ) => [Result<number>, Result<number>];

  /**
   * Passes the given category tag(s) from the filter.
   * If the given category tag(s) does not have an identifier (`id`), the function returns an error.
   * By default, the form 'key' parameter is 'categories'.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`categories`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  categories: (form: FormData, key?: string) => Result<number[]>;

  /**
   * Finalizes the filter and queries for matching product(s).
   *
   * @returns the {@link Promise} that resolves to the corresponding product(s) matched from the filter
   */
  submit: () => DatabaseQuery<Product[], 'id'>;
}
