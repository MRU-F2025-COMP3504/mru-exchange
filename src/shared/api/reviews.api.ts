import { supabase } from '../utils/supabase';
import type { Review } from '../types/database.types';

export const reviewsApi = {
  getProductReviews: async (productId: number) => {
    const { data, error } = await supabase
      .from('Reviews')
      .select(
        `
        *,
        reviewer:created_by_id (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        ),
        reviewed_user:created_on_id (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        )
      `
      )
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  getUserReviews: async (userId: string) => {
    const { data, error } = await supabase
      .from('Reviews')
      .select(
        `
        *,
        Product_Information:product_id (
          id,
          title,
          image
        ),
        reviewed_user:created_on_id (
          first_name,
          last_name,
          user_name
        )
      `
      )
      .eq('created_by_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  getReviewsForUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('Reviews')
      .select(
        `
        *,
        reviewer:created_by_id (
          first_name,
          last_name,
          user_name
        ),
        Product_Information:product_id (
          id,
          title,
          image
        )
      `
      )
      .eq('created_on_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  createReview: async (
    productId: number,
    reviewerId: string,
    reviewedUserId: string,
    rating: number,
    description?: string
  ) => {
    if (rating < 0 || rating > 5) {
      return { data: null, error: { message: 'Rating must be between 0 and 5' } };
    }

    const { data, error } = await supabase
      .from('Reviews')
      .insert({
        product_id: productId,
        created_by_id: reviewerId,
        created_on_id: reviewedUserId,
        rating,
        description,
      })
      .select()
      .single();

    return { data, error };
  },

  updateReview: async (
    reviewId: number,
    updates: {
      rating?: number;
      description?: string;
    }
  ) => {
    if (updates.rating !== undefined && (updates.rating < 0 || updates.rating > 5)) {
      return { data: null, error: { message: 'Rating must be between 0 and 5' } };
    }

    const { data, error } = await supabase
      .from('Reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    return { data, error };
  },

  deleteReview: async (reviewId: number) => {
    const { error } = await supabase.from('Reviews').delete().eq('id', reviewId);

    return { error };
  },

  getProductAverageRating: async (productId: number) => {
    const { data, error } = await supabase
      .from('Reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error || !data || data.length === 0) {
      return { average: 0, count: 0, error };
    }

    const sum = data.reduce((acc, review) => acc + (review.rating || 0), 0);
    const average = sum / data.length;

    return { average, count: data.length, error: null };
  },

  getUserAverageRating: async (userId: string) => {
    const { data, error } = await supabase
      .from('Reviews')
      .select('rating')
      .eq('created_on_id', userId);

    if (error || !data || data.length === 0) {
      return { average: 0, count: 0, error };
    }

    const sum = data.reduce((acc, review) => acc + (review.rating || 0), 0);
    const average = sum / data.length;

    return { average, count: data.length, error: null };
  },
};
