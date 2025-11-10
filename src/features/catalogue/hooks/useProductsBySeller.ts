import type {
  DatabaseQueryResult,
  Product,
  RequiredColumns,
  UserProfile,
} from '@shared/types';
import { useEffect, useState } from 'react';
import { empty, HookUtils } from '@shared/utils';
import { ProductCatalogueAPI } from '@features/catalogue';

interface UseProductsBySellerReturn {
  loading: boolean;
  result: UseProductsBySellerResult;
}

type UseProductsBySellerResult = DatabaseQueryResult<Product[], '*'>;

export default function(seller: RequiredColumns<UserProfile, 'supabase_id'>): UseProductsBySellerReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsBySellerResult>(() => empty());

  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogueAPI.getBySeller(seller))
      .then(setResult);
  }, [seller]);

  return {
    loading,
    result,
  };
}
