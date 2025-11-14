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

interface UseCartReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current bookmarker result state for the user.
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
   * Refreshes the current state.
   *
   * @returns a wrapped query that may contain the product bookmarker
   */
  refresh: () => DatabaseQuery<ProductBookmarker, '*'>;

  /**
   * Bookmarks the given product(s) from the user.
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
   * @param the given product identifier(s)
   * @returns a wrapped query of deleted bookmarked product(s)
   * @see {@link ProductBookmarking.clear()}
   */
  clear: () => DatabaseQuery<BookmarkedProduct[], 'product_id'>;
}

type BookmarkerResult = DatabaseQueryResult<ProductBookmarker, '*'>;

/**
 * Hooks product bookmarking functionality to components.
 *
 * @see {@link ProductBookmarking} for API documentation
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useBookmarker(
  buyer: RequiredColumns<UserProfile, 'supabase_id'>,
): UseCartReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<BookmarkerResult>(() => empty());
  const [products, setProducts] = useState<BookmarkedProduct[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, ProductBookmarking.get(buyer)).then(
      (result) => {
        if (result.ok) {
          setCart(result);
        }

        return result;
      },
    );
  }, [buyer]);

  const store = useCallback(
    async (array: RequiredColumns<Product, 'id'>[]) => {
      if (cart.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.store(cart.data, array),
        ).then((result) => {
          if (result.ok) {
            setProducts([...products, ...result.data]);
          }

          return result;
        });
      }

      return cart;
    },
    [cart, products],
  );

  const remove = useCallback(
    async (array: RequiredColumns<Product, 'id'>[]) => {
      if (cart.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.remove(cart.data, array),
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

      return cart;
    },
    [cart, products],
  );

  const clear = useCallback(async () => {
    if (cart.ok) {
      return HookUtils.load(
        setLoading,
        ProductBookmarking.clear(cart.data),
      ).then((result) => {
        if (!result.ok) {
          return result;
        }

        setProducts([]);

        return result;
      });
    }

    return cart;
  }, [cart]);

  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });
  }, [buyer, refresh]);

  return {
    loading,
    bookmarker: cart,
    products,
    refresh,
    store,
    remove,
    clear,
  };
}
