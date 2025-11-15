import type {
  BookmarkedProduct,
  DatabaseQuery,
  ProductBookmarker,
  RequiredColumns,
  Product,
  DatabaseQueryResult,
  UserProfile,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';
import { useState, useCallback, useEffect } from 'react';
import { ProductBookmarking } from '@features/bookmarking';

/**
 * The return type for the {@link useBookmarker()} hook.
 */
interface UseBookmarkerReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current bookmarker state from the user.
   *
   * To handle the query result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query result that may contain the product bookmarker
   */
  bookmarker: BookmarkerResult;

  /**
   * The current collection of bookmarked products from the user.
   *
   * @returns an unwrapped query result of bookmarked products
   */
  products: BookmarkedProduct[];

  /**
   * Force refreshes the state to the latest update.
   *
   ** To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain the product bookmarker
   */
  refresh: () => DatabaseQuery<ProductBookmarker, '*'>;

  /**
   * Bookmarks the given product(s) from the user.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param the given product identifier(s)
   * @returns a wrapped query of stored bookmarked product(s)
   * @see {@link ProductBookmarking.store}
   */
  store: (
    products: RequiredColumns<Product, 'id'>[],
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes bookmarks on the given product(s) from the user.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param the given product identifier(s)
   * @returns a wrapped query of deleted bookmarked product(s)
   * @see {@link ProductBookmarking.remove()}
   */
  remove: (
    products: RequiredColumns<Product, 'id'>[],
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes all bookmarked products from the user.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param the given product identifier(s)
   * @returns a wrapped query of deleted bookmarked product(s)
   * @see {@link ProductBookmarking.clear()}
   */
  clear: () => DatabaseQuery<BookmarkedProduct[], 'product_id'>;
}

/**
 * An alias for the product bookmarker query result.
 */
type BookmarkerResult = DatabaseQueryResult<ProductBookmarker, '*'>;

/**
 * Hooks product bookmarking functionality.
 * The hook state updates when its dependency states changes.
 *
 * @see {@link ProductBookmarking} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useBookmarker(
  buyer: RequiredColumns<UserProfile, 'supabase_id'>,
): UseBookmarkerReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarker, setBookmarker] = useState<BookmarkerResult>(() => empty());
  const [products, setProducts] = useState<BookmarkedProduct[]>([]);

  /**
   * @see {@link UseBookmarkerReturn.refresh()} for more information
   */
  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, ProductBookmarking.get(buyer)).then(
      (result) => {
        if (result.ok) {
          setBookmarker(result);
        }

        return result;
      },
    );
  }, [buyer]);

  /**
   * Hooks the store() functionality.
   * Updates the callback state when its dependencies (i.e., bookmarker and product) changes state.
   *
   * @see {@link ProductBookmarking.store()}
   */
  const store = useCallback(
    async (array: RequiredColumns<Product, 'id'>[]) => {
      if (bookmarker.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.store(bookmarker.data, array),
        ).then((result) => {
          if (result.ok) {
            setProducts([...products, ...result.data]);
          }

          return result;
        });
      }

      return bookmarker;
    },
    [bookmarker, products],
  );

  /**
   * Hooks the remove() functionality.
   * Updates the callback state when its dependencies (i.e., bookmarker and products) changes state.
   *
   * @see {@link ProductBookmarking.remove()}
   */
  const remove = useCallback(
    async (array: RequiredColumns<Product, 'id'>[]) => {
      if (bookmarker.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.remove(bookmarker.data, array),
        ).then((result) => {
          if (!result.ok) {
            return result;
          }

          setProducts(
            products.filter(
              (product) =>
                !array.find((change) => product.product_id === change.id),
            ),
          );

          return result;
        });
      }

      return bookmarker;
    },
    [bookmarker, products],
  );

  /**
   * Hooks the clear() functionality.
   * Updates the callback state when its dependencies (i.e., bookmarker) changes state.
   *
   * @see {@link ProductBookmarking.clear()}
   */
  const clear = useCallback(async () => {
    if (bookmarker.ok) {
      return HookUtils.load(
        setLoading,
        ProductBookmarking.clear(bookmarker.data),
      ).then((result) => {
        if (!result.ok) {
          return result;
        }

        setProducts([]);

        return result;
      });
    }

    return bookmarker;
  }, [bookmarker]);

  /**
   * Updates the hook state when its dependencies (i.e., buyer) changes state.
   * The {@link refresh()} callback dependency prevents infinite recursion recall.
   */
  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });
  }, [buyer, refresh]);

  return {
    loading,
    bookmarker,
    products,
    refresh,
    store,
    remove,
    clear,
  };
}
