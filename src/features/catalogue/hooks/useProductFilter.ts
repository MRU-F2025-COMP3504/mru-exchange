import type {
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
} from '@shared/types';
import  { ProductCatalogueAPI, type ProductFilter } from '@features/catalogue';
import { useEffect, useState } from 'react';
import { empty, HookUtils } from '@shared/utils';

interface UseProductFilterReturn {
  loading: boolean;
  result: UseProductFilterResult;
}

type UseProductFilterResult = DatabaseQueryResult<Product[], 'id'>;

export default function(run: (filter: ProductFilter) => DatabaseQuery<Product[], 'id'>): UseProductFilterReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductFilterResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, run(ProductCatalogueAPI.getByFilter()))
      .then(setResult);
  }, [run]);

  return {
    loading,
    result,
  }
}