import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import type { DatabaseQueryResult, ShoppingCartTable } from '@shared/types';

export async function getUserCart(
  id: string,
  columns: string,
): DatabaseQueryResult<ShoppingCartTable[]> {
  const { data, error } = await supabase
    .from('Shopping_Cart')
    .select(columns as '*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function addToCart(
  userId: string,
  productId: number,
  columns: string,
): DatabaseQueryResult<ShoppingCartTable> {
  const { data, error } = await supabase
    .from('Shopping_Cart')
    .select(columns as '*')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .single();

  if (data) {
    return err(new Error('Item already in cart'));
  } else if (error) {
    return err(error);
  }

  const result = await supabase
    .from('Shopping_Cart')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (result.error) {
    return err(result.error);
  }

  return ok(result.data);
}

export async function removeFromCart(id: number): DatabaseQueryResult<{}> {
  const { error } = await supabase.from('Shopping_Cart').delete().eq('id', id);
  return error ? err(error) : ok({});
}

export async function removeProductFromCart(
  userId: string,
  productId: number,
): DatabaseQueryResult<{}> {
  const { error } = await supabase
    .from('Shopping_Cart')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  return error ? err(error) : ok({});
}

export async function clearCart(id: string): DatabaseQueryResult<{}> {
  const { error } = await supabase
    .from('Shopping_Cart')
    .delete()
    .eq('user_id', id);

  return error ? err(error) : ok({});
}

export async function isInCart(
  userId: string,
  productId: number,
): DatabaseQueryResult<boolean> {
  const { count, error } = await supabase
    .from('Shopping_Cart')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (count) {
    return ok(count > 0);
  } else if (error) {
    return err(error);
  }

  return ok(false);
}

export async function getCartCount(userId: string) {
  const { count, error } = await supabase
    .from('Shopping_Cart')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (count) {
    return ok(count);
  } else if (error) {
    return err(error);
  }

  return ok(0);
}
