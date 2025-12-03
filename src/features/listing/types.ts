import type {
  DatabaseQuery,
  Product,
  ProductImage,
  RequireProperty,
  Result,
  UserProfile,
} from '@shared/types';

/**
 * Builds a product based on the given initialized inputs for selected product properties.
 * Selection may happen during runtime (e.g., initializing product image property).
 *
 * @see {@link ProductListing.register()}
 */
export interface ProductBuilder {
  /**
   * Initializes the title property.
   * If the given title is empty, the function returns an error.
   * By default, the form `key` parameter is `title`.
   *
   * **The title property must be initialized to publish the product.**
   *
   * @param form the given {@link FormData}
   * @param key the given key (`title`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  title: (form: FormData, key?: string) => Result<string>;

  /**
   * Initializes the description property.
   * If the given description is empty, the function returns an error.
   * By default, the form `key` parameter is `description`.
   *
   * **The description property must be initialized to publish the product.**
   *
   * @param description the given product description
   * @param form the given {@link FormData}
   * @param key the given key (`description`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  description: (form: FormData, key?: string) => Result<string>;

  /**
   * Initializes the image property.
   * If the given images are invalid, the function returns an error.
   * By default, the form `key` parameter is `images`.
   *
   * Initializing the image property is optional.
   *
   * @param paths the given product images
   * @param form the given {@link FormData}
   * @param key the given key (`images`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   * @see {@link REGEX_IMAGE_PATH}
   */
  images: (form: FormData, key?: string) => Result<ProductImage[]>;

  /**
   * Initializes the price property.
   * If the given price value exceeds the minimum (0) bound, the function returns an error.
   * By default, the form `key` parameter is `price`.
   *
   * **The price property must be initialized to publish the product.**
   *
   * @param form the given {@link FormData}
   * @param key the given key (`price`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  price: (form: FormData, key?: string) => Result<number>;

  /**
   * Initializes the stock property.
   * If the given stock value exceeds the minimum (0) bound, the function returns an error.
   * By default, the form `key` parameter is `stock`.
   *
   * Initializing the stock property is optional.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`stock`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  stock: (form: FormData, key?: string) => Result<number>;

  /**
   * Scans the builder for any `undefined` required product properties.
   * The {@link isSatisfied()} does not evaluate any form inputs.
   *
   * @returns if the product builder has all the required properties evaluated
   */
  isSatisfied: () => boolean;

  /**
   * Finalizes the builder and inserts the new product to the database.
   *
   * @returns the {@link Promise} that resolves to the corresponding new product
   */
  submit: () => DatabaseQuery<Product, '*'>;
}

/**
 * Modifies a product attribute based on the selection of product properties.
 * Selection may happen during runtime (e.g., modifing product title property).
 *
 * @see {@link ProductListing.attribute()}
 */
export interface ProductAttributeModifier {
  /**
   * Modifies the title property.
   * If the given title is empty, the function returns an error.
   * By default, the form `key` parameter is `title`.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`title`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  title: (form: FormData, key?: string) => Result<string>;

  /**
   * Modifies the description property.
   * If the given description is empty, the function returns an error.
   * By default, the form `key` parameter is `description`.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`description`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   */
  description: (form: FormData, key?: string) => Result<string>;

  /**
   * Modifies the image property.
   * If the given images are invalid, the function returns an error.
   * By default, the form `key` parameter is `images`.
   *
   * @param form the given {@link FormData}
   * @param key the given key (`images`) to {@link FormDataEntryValue}
   * @returns the {@link Result} that validates the given input
   * @see {@link REGEX_IMAGE_PATH}
   */
  images: (form: FormData, key?: string) => Result<ProductImage[]>;

  /**
   * Finalizes modification and updates the given product.
   *
   * @returns the {@link Promise} that resolves to the corresponding modified product
   */
  submit: () => DatabaseQuery<Product, '*'>;
}
