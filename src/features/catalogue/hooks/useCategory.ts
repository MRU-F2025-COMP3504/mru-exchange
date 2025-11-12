import { useState, useEffect } from 'react';
import { CategoryCatalogueAPI } from '@features/catalogue';
import type {
  Category,
  DatabaseQueryResult,
  RequiredColumns,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';

interface UseCategoryReturn {
  loading: boolean;
  result: UseCategoryResult;
}

type UseCategoryResult = DatabaseQueryResult<Category, '*'>;

/**
 * Hook to fetch a single category
 */
export default function (
  category: RequiredColumns<Category, 'id'>,
): UseCategoryReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoryResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, CategoryCatalogueAPI.getTag(category)).then(
      setResult,
    );
  }, [category]);

  return {
    loading,
    result,
  };
}
