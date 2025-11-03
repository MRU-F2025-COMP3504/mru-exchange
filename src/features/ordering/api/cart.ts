import type {
  DatabaseQuery,
  DatabaseQueryArray,
  DatabaseView,
  PickOmit,
  Product,
  ProductOrder,
  ShoppingCart,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@shared/api';
import { query, view } from '@shared/api/database.ts';

export async function get(user: PickOmit<User, 'id'>): DatabaseView<ShoppingCart> {
  return view(
    await supabase
      .from('Shopping_Cart')
      .select('*')
      .eq('user_id', user.id)
      .single()
  );
}

export async function getProducts(cart: PickOmit<Product, 'id'>): DatabaseView<ProductOrder[]> {
  return view(
    await supabase
      .from('Shopping_Cart_Products')
      .select('*')
      .eq('shopping_cart_id', cart.id)
      .select()
  )
}

export async function register(user: PickOmit<User, 'id'>): DatabaseQuery<ShoppingCart, 'id'> {
  return query(
    await supabase
      .from('Shopping_Cart')
      .insert({
        user_id: user.id
      })
      .select('id')
      .single()
  )
}

export async function store(cart: PickOmit<ShoppingCart, 'id'>, product: PickOmit<Product, 'id'>): DatabaseView<ProductOrder> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .insert({
        shopping_cart_id: cart.id,
        product_id: product.id,
      })
      .select()
      .single()
  )
}

export async function remove(cart: PickOmit<ShoppingCart, 'id'>, product: PickOmit<Product, 'id'>): DatabaseView<ProductOrder> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .delete()
      .eq('shopping_cart_id', cart.id)
      .eq('product_id', product.id)
      .select()
      .single()
  )
}

export async function clear(cart: PickOmit<ShoppingCart, 'id'>): DatabaseQueryArray<ProductOrder, 'product_id'> {
  return query(
    await supabase
      .from('Shopping_Cart_Products')
      .delete()
      .eq('shopping_cart_id', cart.id)
      .select()
  )
}