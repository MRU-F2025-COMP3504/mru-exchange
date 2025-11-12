import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  ShoppingCart,
  ShoppingCartProduct,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';

export async function get(
  user: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<ShoppingCart, '*'> {
  return query(
    await supabase
      .from('Shopping_Cart')
      .select('*')
      .eq('user_id', user.supabase_id)
      .single(),
  );
}

export async function getProducts(
  cart: RequiredColumns<ShoppingCart, 'id'>,
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
  user: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<ShoppingCart, 'id'> {
  return query(
    await supabase
      .from('Shopping_Cart')
      .insert({
        user_id: user.supabase_id,
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
