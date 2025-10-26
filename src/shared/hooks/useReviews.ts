import { useState, useEffect } from 'react';
import { reviewsApi } from '../api/reviews.api';
import type { Review } from '../types/database.ts';

/**
 * Hook to fetch product reviews
 */
export const useProductReviews = (productId: number | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetchReviews();
    fetchAverageRating();
  }, [productId]);

  const fetchReviews = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await reviewsApi.getProductReviews(productId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setReviews(data || []);
    }

    setLoading(false);
  };

  const fetchAverageRating = async () => {
    if (!productId) return;

    const { average, count } =
      await reviewsApi.getProductAverageRating(productId);
    setAverageRating(average);
    setReviewCount(count);
  };

  const refresh = () => {
    fetchReviews();
    fetchAverageRating();
  };

  return {
    reviews,
    loading,
    error,
    averageRating,
    reviewCount,
    refresh,
  };
};

/**
 * Hook to fetch user's reviews (reviews they wrote)
 */
export const useUserReviews = (userId: string | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await reviewsApi.getUserReviews(userId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setReviews(data || []);
    }

    setLoading(false);
  };

  return {
    reviews,
    loading,
    error,
    refresh: fetchReviews,
  };
};

/**
 * Hook to fetch reviews for a user (reviews they received as a seller)
 */
export const useSellerReviews = (userId: string | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchReviews();
    fetchAverageRating();
  }, [userId]);

  const fetchReviews = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await reviewsApi.getReviewsForUser(userId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setReviews(data || []);
    }

    setLoading(false);
  };

  const fetchAverageRating = async () => {
    if (!userId) return;

    const { average, count } = await reviewsApi.getUserAverageRating(userId);
    setAverageRating(average);
    setReviewCount(count);
  };

  const refresh = () => {
    fetchReviews();
    fetchAverageRating();
  };

  return {
    reviews,
    loading,
    error,
    averageRating,
    reviewCount,
    refresh,
  };
};
