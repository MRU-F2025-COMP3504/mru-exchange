import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categories.api';
import type { CategoryTag } from '@shared/types/database/schema.ts';

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await categoriesApi.getAllCategories();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
};

/**
 * Hook to fetch a single category
 */
export const useCategory = (categoryId: number | null) => {
  const [category, setCategory] = useState<CategoryTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await categoriesApi.getCategory(categoryId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCategory(data);
    }

    setLoading(false);
  };

  return {
    category,
    loading,
    error,
    refresh: fetchCategory,
  };
};

/**
 * Hook to fetch catalogue in a category
 */
export const useCategoryProducts = (categoryId: number | null) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    fetchProducts();
    fetchProductCount();
  }, [categoryId]);

  const fetchProducts = async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await categoriesApi.getCategoryProducts(categoryId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const fetchProductCount = async () => {
    if (!categoryId) return;

    const { count } = await categoriesApi.getCategoryProductCount(categoryId);
    setProductCount(count || 0);
  };

  const refresh = () => {
    fetchProducts();
    fetchProductCount();
  };

  return {
    products,
    loading,
    error,
    productCount,
    refresh,
  };
};
