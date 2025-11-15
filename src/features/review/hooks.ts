import type {
  DatabaseQuery,
  Product,
  PromiseResult,
  RequiredColumns,
  Review,
  UserProfile,
} from '@shared/types';
import { HookUtils, ok } from '@shared/utils';
import { UserReviewing } from '@features/review';
import { useCallback, useEffect, useState } from 'react';

/**
 * The return type for the {@link useProductReviewers()} hook.
 */
interface UseProductReviewers {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of reviews from the user.
   *
   * To handle the query result:
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns an unwrapped query result of user reviews
   */
  reviews: Review[];

  /**
   * Force refreshes the state to the latest update.
   *
   ** To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain user reviews
   */
  refresh: () => DatabaseQuery<Review[], '*'>;
}

/**
 * Hooks product reviewer functionality.
 * The hook state updaets when its dependency states changes.
 *
 * @see {@link UserReviewing.getProductReviewByReviewer()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useProductReviewers(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  product: RequiredColumns<Product, 'id'>,
): UseProductReviewers {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  /**
   * @see {@link UseProductReviewers.refresh()} for more information
   */
  const refresh = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getProductReviewByReviewer(reviewer, product),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [product, reviewer]);

  /**
   * Loads the user's reviews once per invocation.
   * The {@link refresh()} callback dependency prevents infinite recursion recall.
   */
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

/**
 * The return type for the {@link useProductReviews()} hook.
 */
interface UseProductReviews {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of user reviews from the product.
   *
   * @return an unwrapped query result of user reviews
   */
  reviews: Review[];

  /**
   * The current averge product rating state from the product.
   *
   * @return the average product rating
   */
  rating: number;

  /**
   * Force refreshes the state to the latest update.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain a successful (OK) result
   */
  refresh: () => PromiseResult<string>;
}

/**
 * Hooks the functionality of fetching product reviews and calculating the average rating.
 * The hook state updates when its dependency states changes.
 *
 * @see {@link UserReviewing.getProductReviews()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useProductReviews(
  product: RequiredColumns<Product, 'id'>,
): UseProductReviews {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);

  /**
   * Hooks the product review fetching functionality.
   * Updates the callback state when its dependencies (i.e., product) changes state.
   *
   * @see {@link UserReviewing.getProductReviews()}
   */
  const fetchReviews = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getProductReviews(product),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [product]);

  /**
   * Hooks the functionality of calculating the average product rating.
   * Updates the callback state when its dependencies (i.e., product) changes state.
   *
   * @see {@link UserReviewing.getAverageProductRating()}
   */
  const fetchAverageRating = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getAverageProductRating(product),
    ).then((result) => {
      if (result.ok) {
        setRating(result.data.rating);
      }

      return result;
    });
  }, [product]);

  /**
   * Updates the callback state when its dependencies (i.e., fetchAverageRating, fetchReviews) changes state.
   *
   * @see {@link UseProductReviews.refresh()} for more information
   */
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

  /**
   * Loads the product reviews once per invocation.
   * The {@link refresh()} callback dependency prevents infinite recursion re-calls.
   */
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

/**
 * The return type for the {@link useSellerReviewers()} hook.
 */
interface UseSellerReviewers {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of user reviews that the seller has accumulated from past product listings.
   *
   * @return an unwrapped query result of user reviews
   */
  reviews: Review[];

  /**
   * Force refreshes the state to the latest update.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain user reviews
   */
  refresh: () => DatabaseQuery<Review[], '*'>;
}

/**
 * Hooks seller reviewer functionality.
 * The hook state updates when its dependency states changes.
 *
 * @see {@link UseSellerReviewers} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useSellerReviewers(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): UseSellerReviewers {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  /**
   * Updates the callback state when its dependencies (i.e., reviewer, seller) changes state.
   *
   * @see {@link UseSellerReviewers.refresh()} for more information
   */
  const refresh = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getSellerReviewByReviewer(reviewer, seller),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [reviewer, seller]);

  /**
   * Loads the seller reviews once per invocation.
   * The {@link refresh()} callback dependency prevents infinite recursion re-calls.
   */
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

/**
 * The return t ype for the {@link useSellerReviews()} hook.
 */
interface UseSellerReviews {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of user reviews that the seller has accumulated from past product listings.
   *
   * @return an unwrapped query result of user reviews
   */
  reviews: Review[];

  /**
   * The current average seller rating state.
   *
   * @return the average seller rating
   */
  rating: number;

  /**
   * Force refreshes the state to the latest update.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain a successful (OK) result
   */
  refresh: () => PromiseResult<string>;
}

/**
 * Hooks the functionality of fetching seller reviews and calculating the average rating.
 * The hook state updates when its dependency states changes.
 *
 * @see {@link UserReviewing.getSellerReviews()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useSellerReviews(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): UseSellerReviews {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);

  /**
   * Hooks the seller review fetching functionality.
   * Updates the callback state when its dependencies (i.e., reviewer) changes state.
   *
   * @see {@link UserReviewing.getSellerReviews()}
   */
  const fetchReviews = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getSellerReviews(reviewer),
    ).then((result) => {
      if (result.ok) {
        setReviews(result.data);
      }

      return result;
    });
  }, [reviewer]);

  /**
   * Hooks the functionality of calculating the average seller rating.
   * Updates the callback state when its dependencies (i.e., seller) changes state.
   *
   * @see {@link UserReviewing.getAverageProductRating()}
   */
  const fetchAverageRating = useCallback(async () => {
    return HookUtils.load(
      setLoading,
      UserReviewing.getAverageSellerRating(seller),
    ).then((result) => {
      if (result.ok) {
        setRating(result.data.rating);
      }

      return result;
    });
  }, [seller]);

  /**
   * Updates the callback state when its dependencies (i.e., fetchAverageRating, fetchReviews) changes state.
   *
   * @see {@link UseSellerReviews.refresh()} for more information
   */
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

  /**
   * Loads the seller reviews once per invocation.
   * The {@link refresh()} callback dependency prevents infinite recursion re-calls.
   */
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
