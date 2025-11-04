import { useState, useEffect } from 'react';
import { productsApi, type ProductFilters } from '../api/catalogue.api';
import type { ProductInformation } from '../types/database/schema.ts';

/**
 * Hook to fetch and manage catalogue
 */
export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<ProductInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await productsApi.getProducts(filters);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const refresh = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refresh,
  };
};

/**
 * Hook to fetch a single product
 */
export const useProduct = (productId: number | null) => {
  const [product, setProduct] = useState<ProductInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await productsApi.getProduct(productId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  const refresh = () => {
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refresh,
  };
};

/**
 * Hook to fetch user's catalogue
 */
export const useUserProducts = (userId: string | null) => {
  const [products, setProducts] = useState<ProductInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUserProducts();
  }, [userId]);

  const fetchUserProducts = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await productsApi.getUserProducts(userId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const refresh = () => {
    fetchUserProducts();
  };

  return {
    products,
    loading,
    error,
    refresh,
  };
};
