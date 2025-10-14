import { supabase } from '../utils/supabase';
import type { ShoppingCart } from '../types/database.types';

export const cartApi = {
  getUserCart: async (userId: string) => {
    const { data, error } = await supabase
      .from('Shopping_Cart')
      .select(
        `
        *,
        Product_Information:product_id (
          *,
          User_Information:user_id (
            first_name,
            last_name,
            user_name
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  addToCart: async (userId: string, productId: number) => {
    const { data: existing } = await supabase
      .from('Shopping_Cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return { data: existing, error: { message: 'Item already in cart' } };
    }

    const { data, error } = await supabase
      .from('Shopping_Cart')
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select()
      .single();

    return { data, error };
  },

  removeFromCart: async (cartItemId: number) => {
    const { error } = await supabase.from('Shopping_Cart').delete().eq('id', cartItemId);

    return { error };
  },

  removeProductFromCart: async (userId: string, productId: number) => {
    const { error } = await supabase
      .from('Shopping_Cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    return { error };
  },

  clearCart: async (userId: string) => {
    const { error } = await supabase.from('Shopping_Cart').delete().eq('user_id', userId);

    return { error };
  },

  isInCart: async (userId: string, productId: number) => {
    const { data, error } = await supabase
      .from('Shopping_Cart')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    return { isInCart: !!data, error };
  },

  getCartCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('Shopping_Cart')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return { count, error };
  },
};
