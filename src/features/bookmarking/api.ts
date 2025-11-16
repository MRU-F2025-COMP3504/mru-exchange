import type {
  DatabaseQuery,
  Product,
  RequireProperty,
  ProductBookmarker,
  BookmarkedProduct,
  UserProfile,
} from '@shared/types';
import { supabase } from '@shared/api';
import { query } from '@shared/utils';

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
    user: RequireProperty<UserProfile, 'supabase_id'>,
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
    bookmarker: RequireProperty<ProductBookmarker, 'id'>,
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
    user: RequireProperty<UserProfile, 'supabase_id'>,
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
    bookmarker: RequireProperty<ProductBookmarker, 'id'>,
    products: RequireProperty<Product, 'id'>[],
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
    bookmarker: RequireProperty<ProductBookmarker, 'id'>,
    products: RequireProperty<Product, 'id'>[],
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
    bookmarker: RequireProperty<ProductBookmarker, 'id'>,
  ): DatabaseQuery<BookmarkedProduct[], 'product_id'>;
}

/**
 * The product bookmarking feature plays a central role in selecting which products to exchange.
 * When the buyer navigates to the product page, the buyer is presented with a bookmark button that makes a request for exchange.
 * The product bookmarker holds products bookmarked by the buyer.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
export const ProductBookmarking: ProductBookmarking = {
  get: async (
    user: RequireProperty<UserProfile, 'supabase_id'>,
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
    cart: RequireProperty<ProductBookmarker, 'id'>,
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
    user: RequireProperty<UserProfile, 'supabase_id'>,
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
    cart: RequireProperty<ProductBookmarker, 'id'>,
    products: RequireProperty<Product, 'id'>[],
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
    cart: RequireProperty<ProductBookmarker, 'id'>,
    products: RequireProperty<Product, 'id'>[],
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
    cart: RequireProperty<ProductBookmarker, 'id'>,
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
