import { ProductBookmarking } from '@features/bookmarking';
import { useAuth } from '@shared/contexts';
import type {
  BookmarkedProduct,
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
  ProductBookmarker,
  RequireProperty,
  Result,
} from '@shared/types';
import { err, HookUtils, ok } from '@shared/utils';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
   * Retrieves a single product by the given product identifier.
   *
   * @param product the given product identifier
   * @returns the {@link Result} that may contain the bookmarked product.
   */
  getBookmarkedProduct: (
    product: RequireProperty<Product, 'id'>,
  ) => Result<BookmarkedProduct>;

  /**
   * Bookmarks the given product from the user.
   *
   * @param product given product identifier
   * @returns the {@link DatabaseQuery} of stored bookmarked product
   * @see {@link ProductBookmarking.store()}
   */
  store: (
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<BookmarkedProduct, '*'>;

  /**
   * Removes bookmarks on the given product from the user.
   *
   * @param product given product identifier(s)
   * @returns the {@link DatabaseQuery} of deleted bookmarked product
   * @see {@link ProductBookmarking.remove()}
   */
  remove: (
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<BookmarkedProduct, '*'>;

  /**
   * Removes all bookmarked product(s) from the user.
   *
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
export function useBookmarker(): UseBookmarker {
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarker, setBookmarker] = useState<BookmarkerResult>(() =>
    err('No bookmarker found'),
  );
  const [products, setProducts] = useState<BookmarkedProduct[]>([]);
  const { profile: buyer } = useAuth();
  const navigate = useNavigate();

  /**
   * Updates the callback state when its dependencies (i.e., buyer) changes state.
   *
   * @see {@link UseBookmarker.refresh()}
   */
  const refresh = useCallback(async () => {
    if (buyer.ok) {
      return await ProductBookmarking.get(buyer.data).then(async (result) => {
        setBookmarker(result);

        if (result.ok) {
          void HookUtils.load(
            setLoading,
            ProductBookmarking.getProducts(result.data),
          ).then((products) => {
            if (products.ok) {
              setProducts(products.data);
            }
          });

          return result;
        } else {
          return HookUtils.load(
            setLoading,
            ProductBookmarking.register(buyer.data),
          ).then((bookmarker) => {
            setBookmarker(bookmarker);

            return result;
          });
        }
      });
    }

    return err('No user profile found', buyer) as DatabaseQueryResult<
      ProductBookmarker,
      '*'
    >;
  }, [buyer]);

  /**
   * Updates the callback state when its dependencies (i.e., bookmarker) changes state.
   *
   * @see {@link UseBookmarker.getProduct()}
   */
  const getBookmarkedProduct = useCallback(
    (product: RequireProperty<Product, 'id'>): Result<BookmarkedProduct> => {
      for (const value of products) {
        if (value.product_id === product.id) {
          return ok(value);
        }
      }

      return err('No product found', product);
    },
    [products],
  );

  /**
   * Hooks the `store()` functionality.
   * Updates the callback state when its dependencies (i.e., bookmarker and products) changes state.
   *
   * @see {@link ProductBookmarking.store()}
   */
  const store = useCallback(
    async (product: RequireProperty<Product, 'id'>) => {
      if (bookmarker.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.store(bookmarker.data, product),
        ).then((result) => {
          if (result.ok) {
            setProducts([...products, result.data]);
          }

          return result;
        });
      }

      return bookmarker;
    },
    [bookmarker, products],
  );

  /**
   * Hooks the `remove()` functionality.
   * Updates the callback state when its dependencies (i.e., bookmarker and products) changes state.
   *
   * @see {@link ProductBookmarking.remove()}
   */
  const remove = useCallback(
    async (product: RequireProperty<Product, 'id'>) => {
      if (bookmarker.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.remove(bookmarker.data, product),
        ).then((result) => {
          if (result.ok) {
            setProducts(
              products.filter((value) => value.product_id !== product.id),
            );
          }

          return result;
        });
      }

      return bookmarker;
    },
    [bookmarker, products],
  );

  /**
   * Hooks the `clear()` functionality.
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
        if (result.ok) {
          setProducts([]);
        }

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
    void refresh();
  }, [buyer, refresh, navigate]);

  return {
    loading,
    bookmarker,
    products,
    getBookmarkedProduct,
    refresh,
    store,
    remove,
    clear,
  };
}
