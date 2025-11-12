import type {
  Product,
  PromiseResult,
  RequiredColumns,
  Review,
} from '@shared/types';
import { HookUtils, ok } from '@shared/utils';
import { ReviewAPI } from '@features/review';
import { useCallback, useEffect, useState } from 'react';

interface UseProductReviewsReturn {
  loading: boolean;
  reviews: Review[];
  rating: number;
  refresh: () => PromiseResult<string>;
}

export default function (
  product: RequiredColumns<Product, 'id'>,
): UseProductReviewsReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);

  const fetchReviews = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      ReviewAPI.getProductReviews(product),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [product]);

  const fetchAverageRating = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      ReviewAPI.getAverageProductRating(product),
    ).then((result) => {
      if (result.ok) {
        setRating(result.data.rating);
      }

      return result;
    });
  }, [product]);

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
    void refresh().then((result) => {
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
