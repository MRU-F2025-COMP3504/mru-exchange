import { useState, useEffect } from 'react';
import { ProductCatalogueAPI } from '@features/catalogue';
import type { DatabaseQueryResult, Product } from '@shared/types';
import { empty, HookUtils } from '@shared/utils';

interface UseProductSearchReturn {
  loading: boolean;
  result: UseProductSearchResult;
}

type UseProductSearchResult = DatabaseQueryResult<Product[], '*'>;

export default function (text: string): UseProductSearchReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductSearchResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogueAPI.getBySearch(text)).then(
      setResult,
    );
  }, [text]);

  return {
    loading,
    result,
  };
}
