import type {
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
  RequiredColumns,
  ShoppingCart,
  ShoppingCartProduct,
  UserProfile,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';
import { CartAPI } from '@features/ordering';
import { useCallback, useEffect, useState } from 'react';

interface UseCartReturn {
  loading: boolean;
  cart: ShoppingCartResult;
  products: ShoppingCartProduct[];
  refresh: () => DatabaseQuery<ShoppingCart, '*'>;
  store: (...array: RequiredColumns<Product, 'id'>[]) => DatabaseQuery<ShoppingCartProduct[], '*'>;
  remove: (...array: RequiredColumns<Product, 'id'>[]) => DatabaseQuery<ShoppingCartProduct[], '*'>;
  clear: () => DatabaseQuery<ShoppingCartProduct[], 'product_id'>;
}

type ShoppingCartResult = DatabaseQueryResult<ShoppingCart, '*'>;

export default function(buyer: RequiredColumns<UserProfile, 'supabase_id'>): UseCartReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<ShoppingCartResult>(() => empty());
  const [products, setProducts] = useState<ShoppingCartProduct[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, CartAPI.get(buyer))
      .then((result) => {
        if (result.ok) {
          setCart(result);
        }

        return result;
      });
  }, [buyer]);

  const store = useCallback(async (...array: RequiredColumns<Product, 'id'>[]) => {
    if (cart.ok) {
      return HookUtils.load(setLoading, CartAPI.store(cart.data,...array))
        .then((result) => {
          if (result.ok) {
            setProducts([...products, ...result.data]);
          }

          return result;
        });
    }

    return cart;
  }, [cart, products]);

  const remove = useCallback(async (...array: RequiredColumns<Product, 'id'>[]) => {
    if (cart.ok) {
      return HookUtils.load(setLoading, CartAPI.remove(cart.data, ...array))
        .then((result) => {
          if (!result.ok) {
            return result;
          }

          setProducts(products.filter((product) => !array.find((change) => product.product_id === change.id)));

          return result;
        });
    }

    return cart;
  }, [cart, products]);

  const clear = useCallback(async () => {
    if (cart.ok) {
      return HookUtils.load(setLoading, CartAPI.clear(cart.data))
        .then((result) => {
          if (!result.ok) {
            return result;
          }

          setProducts([]);

          return result;
        })
    }

    return cart;
  }, [cart]);

  useEffect(() => {
    void refresh()
      .then((result) => {
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
  }
}