import { ProductBookmarking } from '@features/bookmarking';
import type {
  BookmarkedProduct,
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
  ProductBookmarker,
  RequireProperty,
  UserProfile,
} from '@shared/types';
import { err, HookUtils } from '@shared/utils';
import { useCallback, useEffect, useState } from 'react';

/**
 * The return type for the {@link useBookmarker()} hook.
 */
interface UseBookmarker {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current bookmarker state from the user.
   *
   * @returns the {@link DatabaseQueryResult} that may contain the product bookmarker
   */
  bookmarker: BookmarkerResult;

  /**
   * The current collection of bookmarked products from the user.
   *
   * @returns the unwrapped {@link DatabaseQueryResult} of bookmarked products
   */
  products: BookmarkedProduct[];

  /**
   * Force refreshes the state to the latest update.
   *
   * @returns the {@link DatabaseQuery} that may contain the product bookmarker
   */
  refresh: () => DatabaseQuery<ProductBookmarker, '*'>;

  /**
   * Bookmarks the given product(s) from the user.
   *
   * @param the given product identifier(s)
   * @returns the {@link DatabaseQuery} of stored bookmarked product(s)
   * @see {@link ProductBookmarking.store()}
   */
  store: (
    products: RequireProperty<Product, 'id'>[],
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes bookmarks on the given product(s) from the user.
   *
   * @param the given product identifier(s)
   * @returns the {@link DatabaseQuery} of deleted bookmarked product(s)
   * @see {@link ProductBookmarking.remove()}
   */
  remove: (
    products: RequireProperty<Product, 'id'>[],
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;

  /**
   * Removes all bookmarked products from the user.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param the given product identifier(s)
   * @returns the {@link DatabaseQuery} of deleted bookmarked product(s)
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
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link ProductBookmarking} for more information
 */
export function useBookmarker(
  buyer: RequireProperty<UserProfile, 'supabase_id'>,
): UseBookmarker {
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarker, setBookmarker] = useState<BookmarkerResult>(() =>
    err('No bookmarker found'),
  );
  const [products, setProducts] = useState<BookmarkedProduct[]>([]);

  /**
   * Updates the callback state when its dependencies (i.e., buyer) changes state.
   *
   * @see {@link UseBookmarker.refresh()}
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
    async (array: RequireProperty<Product, 'id'>[]) => {
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
    async (array: RequireProperty<Product, 'id'>[]) => {
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
   * Loads the bookmarker once per invocation.
   * Updates the hook state when its dependencies (i.e., buyer) changes state.
   * The {@link refresh()} callback dependency prevents infinite recursion re-calls.
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
