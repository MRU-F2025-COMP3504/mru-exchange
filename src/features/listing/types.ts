import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  Result,
  UserProfile,
} from '@shared/types';

/**
 * Builds products based on the given initialized inputs for selected product properties.
 * Selection may happen during runtime (e.g., initializing product image property).
 *
 * @see {@link ProductListing.register()}
 */
export interface ProductBuilder {
  /**
   * Initializes the seller property.
   * If the given seller does not have a `supabase_id` property, the function returns an error.
   *
   * **The seller propery must be initialized to publish the product.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param seller the given user identifier
   * @returns a result that validates the given input
   */
  seller: (id: RequiredColumns<UserProfile, 'supabase_id'>) => Result<this>;

  /**
   * Initializes the title property.
   * If the given title is empty, the function returns an error.
   *
   * **The title property must be initialized to publish the product.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param title the given product title
   * @returns a result that validates the given input
   */
  title: (title: string) => Result<this>;

  /**
   * Initializes the description property.
   * If the given description is empty, the function returns an error.
   *
   * Initializing the description property is optional.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param description the given product description
   * @returns a result that validates the given input
   */
  description: (description: string) => Result<this>;

  /**
   * Initializes the image property.
   * If the given images are invalid, the function returns an error.
   *
   * Initializing the image property is optional.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @see {@link REGEX_IMAGE_PATH} for more information on the image path validation algorithm
   *
   * @param paths the given product image paths
   * @returns a result that validates the given input
   */
  image: (paths: string[]) => Result<this>;

  /**
   * Initializes the price property.
   * If the given price value exceeds the minimum (0) bound, the function returns an error.
   *
   * **The price property must be initialized to publish the product.**
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param price the given product price value
   * @returns a result that validates the given input
   */
  price: (price: number) => Result<this>;

  /**
   * Initializes the stock property.
   * If the given stock value exceeds the minimum (0) bound, the function returns an error.
   *
   * Initializing the stock property is optional.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param price the given product stock value
   * @returns a result that validates the given input
   */
  stock: (stock: number) => Result<this>;

  /**
   * Finalizes the builder and inserts the new product to the database.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding new product
   */
  build: () => DatabaseQuery<Product, 'id'>;
}

/**
 * Modifies product attributes based on the selection of product properties.
 * Selection may happen during runtime (e.g., modifing product title property).
 *
 * @see {@likn ProductListing.attribute()}
 */
export interface ProductAttributeModifier {
  /**
   * Modifies the title property.
   * If the given title is empty, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param title the given product title
   * @returns a result that validates the given input
   */
  title: (title: string) => Result<this>;

  /**
   * Modifies the description property.
   * If the given description is empty, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param title the given product description
   * @returns a result that validates the given input
   */
  description: (description: string) => Result<this>;

  /**
   * Modifies the image property.
   * If the given images are invalid, the function returns an error.
   *
   * To handle the validation result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @see {@link REGEX_IMAGE_PATH} for more information on the image path validation algorithm
   *
   * @param url the given product image paths
   * @returns a result that validates the given input
   */
  image: (url: string) => Result<this>;

  /**
   * Finalizes modification and updates the given product.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to the corresponding modified product
   */
  modify: () => DatabaseQuery<Product, 'id'>;
}
