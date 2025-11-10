import { useState, useEffect } from 'react';
import { cartApi } from '../api/cart.api';
import type { ShoppingCart } from '../types/database/schema.ts';

// Manage user's shopping cart
export const useCart = (userId: string | null) => {
  const [cartItems, setCartItems] = useState<ShoppingCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await cartApi.getUserCart(userId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCartItems(data || []);
    }

    setLoading(false);
  };

  const addToCart = async (productId: number) => {
    if (!userId) return { data: null, error: { message: 'Not authenticated' } };

    const result = await cartApi.addToCart(userId, productId);

    if (result.data) {
      await fetchCart();
    }

    return result;
  };

  const removeFromCart = async (cartItemId: number) => {
    const result = await cartApi.removeFromCart(cartItemId);

    if (!result.error) {
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    }

    return result;
  };

  const removeProduct = async (productId: number) => {
    if (!userId) return { error: { message: 'Not authenticated' } };

    const result = await cartApi.removeProductFromCart(userId, productId);

    if (!result.error) {
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
    }

    return result;
  };

  const clearCart = async () => {
    if (!userId) return { error: { message: 'Not authenticated' } };

    const result = await cartApi.clearCart(userId);

    if (!result.error) {
      setCartItems([]);
    }

    return result;
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.product_id === productId);
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    removeProduct,
    clearCart,
    isInCart,
    refresh: fetchCart,
    count: cartItems.length,
  };
};

// Check if a specific product is in the cart
export const useIsInCart = (
  userId: string | null,
  productId: number | null,
) => {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !productId) {
      setLoading(false);
      return;
    }

    checkCart();
  }, [userId, productId]);

  const checkCart = async () => {
    if (!userId || !productId) return;

    setLoading(true);

    const { isInCart: inCart } = await cartApi.isInCart(userId, productId);
    setIsInCart(inCart);

    setLoading(false);
  };

  const toggle = async () => {
    if (!userId || !productId) {
      return { error: { message: 'Missing user or product' } };
    }

    if (isInCart) {
      const result = await cartApi.removeProductFromCart(userId, productId);
      if (!result.error) {
        setIsInCart(false);
      }
      return result;
    } else {
      const result = await cartApi.addToCart(userId, productId);
      if (result.data) {
        setIsInCart(true);
      }
      return result;
    }
  };

  return {
    isInCart,
    loading,
    toggle,
    refresh: checkCart,
  };
};
