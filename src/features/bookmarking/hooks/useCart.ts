import type {
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
  RequiredColumns,
  ProductBookmarker,
  BookmarkedProduct,
  UserProfile,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';
import { ProductBookmarking } from '@features/ordering';
import { useCallback, useEffect, useState } from 'react';

interface UseCartReturn {
  loading: boolean;
  cart: ShoppingCartResult;
  products: BookmarkedProduct[];
  refresh: () => DatabaseQuery<ProductBookmarker, '*'>;
  store: (
    ...array: RequiredColumns<Product, 'id'>[]
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;
  remove: (
    ...array: RequiredColumns<Product, 'id'>[]
  ) => DatabaseQuery<BookmarkedProduct[], '*'>;
  clear: () => DatabaseQuery<BookmarkedProduct[], 'product_id'>;
}

type ShoppingCartResult = DatabaseQueryResult<ProductBookmarker, '*'>;

export default function (
  buyer: RequiredColumns<UserProfile, 'supabase_id'>,
): UseCartReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<ShoppingCartResult>(() => empty());
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
    async (...array: RequiredColumns<Product, 'id'>[]) => {
      if (cart.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.store(cart.data, ...array),
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
    async (...array: RequiredColumns<Product, 'id'>[]) => {
      if (cart.ok) {
        return HookUtils.load(
          setLoading,
          ProductBookmarking.remove(cart.data, ...array),
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
    cart,
    products,
    refresh,
    store,
    remove,
    clear,
  };
}
