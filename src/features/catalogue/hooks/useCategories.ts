import { useState, useEffect } from 'react';
import { CategoryCatalogueAPI } from '@features/catalogue';
import type {
  Category,
  DatabaseQueryResult,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';

interface UseCategoriesReturn {
  loading: boolean;
  result: UseCategoriesResult;
}

type UseCategoriesResult = DatabaseQueryResult<Category[], '*'>;

/**
 * Hook to fetch all categories
 */
export default function(): UseCategoriesReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoriesResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, CategoryCatalogueAPI.getTags())
      .then(setResult);
  }, []);

  return {
    loading,
    result,
  };
}