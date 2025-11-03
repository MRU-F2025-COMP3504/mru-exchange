import type {
  DatabaseQuery,
  DatabaseQueryArray,
  DatabaseView,
  Product,
  RequiredColumns,
  ShoppingCart,
  ShoppingCartProduct,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@shared/api';
import { query, view } from '@shared/utils';

export async function get(
  user: RequiredColumns<User, 'id'>,
): DatabaseView<ShoppingCart> {
  return view(
    await supabase
      .from('Shopping_Cart')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  );
}

export async function getProducts(
  cart: RequiredColumns<Product, 'id'>,
): DatabaseView<ShoppingCartProduct[]> {
  return view(
    await supabase
      .from('Shopping_Cart_Products')
      .select('*')
      .eq('shopping_cart_id', cart.id)
      .select(),
  );
}

export async function register(
  user: RequiredColumns<User, 'id'>,
): DatabaseQuery<ShoppingCart, 'id'> {
  return query(
    await supabase
      .from('Shopping_Cart')
      .insert({
        user_id: user.id,
      })
      .select('id')
      .single(),
  );
}

export async function store(
  cart: RequiredColumns<ShoppingCart, 'id'>,
  product: RequiredColumns<Product, 'id'>,
): DatabaseView<ShoppingCartProduct> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .insert({
        shopping_cart_id: cart.id,
        product_id: product.id,
      })
      .select()
      .single(),
  );
}

export async function remove(
  cart: RequiredColumns<ShoppingCart, 'id'>,
  product: RequiredColumns<Product, 'id'>,
): DatabaseView<ShoppingCartProduct> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .delete()
      .eq('shopping_cart_id', cart.id)
      .eq('product_id', product.id)
      .select()
      .single(),
  );
}

export async function clear(
  cart: RequiredColumns<ShoppingCart, 'id'>,
): DatabaseQueryArray<ShoppingCartProduct, 'product_id'> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .delete()
      .eq('shopping_cart_id', cart.id)
      .select(),
  );
}
