import type {
  DatabaseQuery,
  RequiredColumns,
  Review,
  UserProfile,
} from '@shared/types';
import { HookUtils } from '@shared/utils';
import { ReviewAPI } from '@features/review';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerReviewersReturn {
  loading: boolean;
  reviews: Review[];
  refresh: () => DatabaseQuery<Review[], '*'>;
}

export default function (
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): UseSellerReviewersReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      ReviewAPI.getSellerReviewsByReviewer(reviewer, seller),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [reviewer, seller]);

  useEffect(() => {
    void refresh().then((result) => {
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
