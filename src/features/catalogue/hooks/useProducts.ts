import { useState, useEffect } from 'react';
import { ProductCatalogueAPI } from '@features/catalogue';
import type {
  DatabaseQueryResult,
  Product,
  RequiredColumns,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';

interface UseProductsReturn {
  loading: boolean;
  result: UseProductsResult;
}

type UseProductsResult = DatabaseQueryResult<Product[], '*'>;

export default function (
  ...array: RequiredColumns<Product, 'id'>[]
): UseProductsReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogueAPI.get(...array)).then(
      setResult,
    );
  }, [array]);

  return {
    loading,
    result,
  };
}
