import type {
  PromiseResult,
  RequiredColumns,
  Review,
  UserProfile,
} from '@shared/types';
import { HookUtils, ok } from '@shared/utils';
import { ReviewAPI } from '@features/review';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerReviewsReturn {
  loading: boolean;
  reviews: Review[];
  rating: number;
  refresh: () => PromiseResult<string>;
}

export default function(reviewer: RequiredColumns<UserProfile, 'supabase_id'>, seller: RequiredColumns<UserProfile, 'supabase_id'>): UseSellerReviewsReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);

  const fetchReviews = useCallback(async () => {
    return HookUtils.load(setLoading, ReviewAPI.getSellerReviews(reviewer))
      .then((result) => {
        if (result.ok) {
          setReviews(result.data);
        }

        return result;
      });
  }, [reviewer]);

  const fetchAverageRating = useCallback(async () => {
    return HookUtils.load(setLoading, ReviewAPI.getAverageSellerRating(seller))
      .then((result) => {
        if (result.ok) {
          setRating(result.data.rating);
        }

        return result;
      });
  }, [seller]);

  const refresh = useCallback(async () => {
    const rating = await fetchAverageRating();
    if (!rating.ok) {
      return rating;
    }

    const reviews = await fetchReviews();
    if (!reviews.ok) {
      return reviews;
    }

    return ok('OK');
  }, [fetchAverageRating, fetchReviews]);

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
    rating,
    refresh,
  };
}