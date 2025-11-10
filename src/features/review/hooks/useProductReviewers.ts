import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  Review,
  UserProfile,
} from '@shared/types';
import { HookUtils } from '@shared/utils';
import { ReviewAPI } from '@features/review';
import { useCallback, useEffect, useState } from 'react';

interface UseProductReviewersReturn {
  loading: boolean;
  reviews: Review[];
  refresh: () => DatabaseQuery<Review[], '*'>;
}

export default function(reviewer: RequiredColumns<UserProfile, 'supabase_id'>, product: RequiredColumns<Product, 'id'>): UseProductReviewersReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, ReviewAPI.getProductReviewsByReviewer(reviewer, product))
      .then((result) => {
        if (result.ok) {
          setReviews(result.data);
        }

        return result;
      })
  }, [product, reviewer]);

  useEffect(() => {
    void refresh()
      .then((result) => {
        if (!result.ok) {
          console.error(result.error);
        }
      });
  }, [refresh]);

  return {
    loading,
    reviews,
    refresh,
  };
}