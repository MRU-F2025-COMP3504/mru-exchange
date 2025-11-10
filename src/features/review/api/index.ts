import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  Result,
  Review,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import type { ReviewPublisher } from '@features/review';
import { err, ok } from '@shared/utils';

export async function getProductReviews(
  product: RequiredColumns<Product, 'id'>,
): DatabaseQuery<Review[], '*'> {
  return query(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getProductReviewsByReviewer(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  product: RequiredColumns<Product, 'id'>,
): DatabaseQuery<Review[], '*'> {
  return query(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('product_id', product.id)
      .eq('created_by_id', reviewer.supabase_id)
      .order('created_at', { ascending: false }),
  );
}

export async function getSellerReviews(
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<Review[], '*'> {
  return query(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('created_on_id', seller.supabase_id)
      .order('created_at', { ascending: false }),
  );
}

export async function getSellerReviewsByReviewer(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<Review[], '*'> {
  return query(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('created_by_id', reviewer.supabase_id)
      .eq('created_on_id', seller.supabase_id)
      .order('created_at', { ascending: false }),
  );
}

export async function getAverageProductRating(
  product: RequiredColumns<Product, 'id'>,
): DatabaseQuery<Review, 'id' | 'rating'> {
  return query(
    await supabase
      .from('Reviews')
      .select('product_id,rating:rating.ave()')
      .eq('product_id', product.id)
      .single(),
  );
}

export async function getAverageSellerRating(
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<Review, 'rating'> {
  return query(
    await supabase
      .from('User_Information')
      .select('rating')
      .eq('supabase_id', seller.supabase_id)
      .single(),
  );
}

export function create(
  reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
): ReviewPublisher {
  const review: Partial<Review> = {};
  return {
    description(description: string): Result<ReviewPublisher> {
      if (!description) {
        return err(new Error('Review description is not specified'));
      } else {
        review.description = description;
      }

      return ok(this);
    },
    rating(rating: number): Result<ReviewPublisher> {
      if (rating < 0) {
        return err(new Error('Review rating cannot be negative'));
      } else if (rating > 5) {
        return err(new Error('Review rating exceeds max rating'));
      } else {
        review.rating = rating;
      }

      return ok(this);
    },
    async publish(): DatabaseQuery<Review, 'id'> {
      return query(
        await supabase
          .from('Reviews')
          .insert({
            ...review,
            created_by_id: reviewer.supabase_id,
          } as Review)
          .select()
          .single(),
      );
    },
  };
}

export async function remove(
  review: RequiredColumns<Review, 'id'>,
): DatabaseQuery<Review, 'id'> {
  return query(
    await supabase
      .from('Reviews')
      .delete()
      .eq('id', review.id)
      .select()
      .single(),
  );
}

export async function update(
  review: RequiredColumns<Review, 'id' | 'rating' | 'description'>,
): DatabaseQuery<Review, 'id'> {
  return query(
    await supabase
      .from('Reviews')
      .update(review)
      .eq('id', review.id)
      .select('id')
      .single(),
  );
}
