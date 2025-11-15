import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  ProductBookmarker,
  BookmarkedProduct,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';

/**
 * See the implementation below for more information.
 */
interface ProductBookmarking {
  /**
   * Retrieves the product bookmarker of the given user.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param user the given user's identifier
   * @returns a promise that resolves to the corresponding user's bookmarker
   */
  get(
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<ProductBookmarker, '*'>;

  /**
   * Retrieves products bookmarked by the given user.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param bookmarker the given bookmarker identifier
   * @returns a promise that resolves to the corresponding products bookmarked by the given user
   */
  getProducts(
    bookmarker: RequiredColumns<ProductBookmarker, 'id'>,
  ): DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Registers the user with a bookmarker.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param user the given user's identifier
   * @returns a promise that resolves to the corresponding user's bookmarker
   */
  register(
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<ProductBookmarker, 'id'>;

  /**
   * Bookmarks the given product(s) for the given user (bookmarker).
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param bookmarker the given bookmarker identifier
   * @param products the given product identifier(s)
   * @returns a promise that resolves to the corresponding product(s) bookmarked by the given user
   */
  store(
    bookmarker: RequiredColumns<ProductBookmarker, 'id'>,
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes the given bookmarked products from the given user (bookmarker).
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param bookmarker the given bookmarker identifier
   * @param products the given product identifier(s)
   * @returns a promise that resolves to the corresponding product(s) bookmarked by the given user
   */
  remove(
    bookmarker: RequiredColumns<ProductBookmarker, 'id'>,
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes the entire bookmarked products from the user (bookmarker).
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param bookmarker the bookmarker identifier
   * @returns a promise that resolves to the corresponding product(s) bookmarked by the given user
   */
  clear(
    bookmarker: RequiredColumns<ProductBookmarker, 'id'>,
  ): DatabaseQuery<BookmarkedProduct[], 'product_id'>;
}

/**
 * Product bookmarking plays a central role in selecting which products to exchange.
 * When the buyer navigates to the product page, the buyer is presented with a bookmark button that makes a request for exchange.
 * The product bookmarker holds products bookmarked by the buyer.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export const ProductBookmarking: ProductBookmarking = {
  get: async (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<ProductBookmarker, '*'> => {
    return query(
      await supabase
        .from('Shopping_Cart')
        .select('*')
        .eq('user_id', user.supabase_id)
        .single(),
    );
  },
  getProducts: async (
    cart: RequiredColumns<ProductBookmarker, 'id'>,
  ): DatabaseQuery<BookmarkedProduct[], '*'> => {
    return query(
      await supabase
        .from('Shopping_Cart_Products')
        .select('*')
        .eq('shopping_cart_id', cart.id)
        .select(),
    );
  },
  register: async (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<ProductBookmarker, 'id'> => {
    return query(
      await supabase
        .from('Shopping_Cart')
        .insert({
          user_id: user.supabase_id,
        })
        .select('id')
        .single(),
    );
  },
  store: async (
    cart: RequiredColumns<ProductBookmarker, 'id'>,
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<BookmarkedProduct[], '*'> => {
    const id = cart.id;
    return query(
      await supabase
        .from('Shopping_Cart_Products')
        .insert(
          products.map((product) => ({
            shopping_cart_id: id,
            product_id: product.id,
          })),
        )
        .select('*'),
    );
  },
  remove: async (
    cart: RequiredColumns<ProductBookmarker, 'id'>,
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<BookmarkedProduct[], '*'> => {
    return query(
      await supabase
        .from('Shopping_Cart_Products')
        .delete()
        .eq('shopping_cart_id', cart.id)
        .in(
          'id',
          products.map((product) => product.id),
        )
        .select('*'),
    );
  },
  clear: async (
    cart: RequiredColumns<ProductBookmarker, 'id'>,
  ): DatabaseQuery<BookmarkedProduct[], 'product_id'> => {
    return query(
      await supabase
        .from('Shopping_Cart_Products')
        .delete()
        .eq('shopping_cart_id', cart.id)
        .select('product_id'),
    );
  },
};
