import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  ShoppingCart,
  ShoppingCartProduct,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { query, supabase } from '@shared/api';

export async function get(
  user: RequiredColumns<User, 'id'>,
): DatabaseQuery<ShoppingCart, '*'> {
  return query(
    await supabase
      .from('Shopping_Cart')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  );
}

export async function getProducts(
  cart: RequiredColumns<Product, 'id'>,
): DatabaseQuery<ShoppingCartProduct[], '*'> {
  return query(
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
  ...products: RequiredColumns<Product, 'id'>[]
): DatabaseQuery<ShoppingCartProduct[], '*'> {
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
}

export async function remove(
  cart: RequiredColumns<ShoppingCart, 'id'>,
  ...products: RequiredColumns<Product, 'id'>[]
): DatabaseQuery<ShoppingCartProduct[], '*'> {
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
}

export async function clear(
  cart: RequiredColumns<ShoppingCart, 'id'>,
): DatabaseQuery<ShoppingCartProduct[], 'product_id'> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .delete()
      .eq('shopping_cart_id', cart.id)
      .select('product_id'),
  );
}
