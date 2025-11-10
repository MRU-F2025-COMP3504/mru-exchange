import { useState, useEffect } from 'react';
import { CategoryCatalogueAPI } from '@features/catalogue';
import type {
  CategorizedProduct,
  Category,
  DatabaseQueryResult,
  RequiredColumns,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';

interface UseCategorizedProductsReturn {
  loading: boolean;
  result: UseCategorizedProductsResult;
}

type UseCategorizedProductsResult = DatabaseQueryResult<CategorizedProduct[], '*'>;

/**
 * Hook to fetch catalogue in a category
 */
export default function(category: RequiredColumns<Category, 'id'>): UseCategorizedProductsReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategorizedProductsResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, CategoryCatalogueAPI.getProductsByAssignedTag(category))
      .then(setResult);
  }, [category]);

  return {
    loading,
    result,
  }
}