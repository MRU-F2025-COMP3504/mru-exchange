import type {
  DatabaseQuery,
  DatabaseView,
  Product,
  RequiredColumns,
  Result,
  Review,
} from '@shared/types';
import { supabase } from '@shared/api';
import type { User } from '@supabase/supabase-js';
import type { ReviewPublisher } from '@features/review/types';
import { err, ok, query, view } from '@shared/utils';

export async function getProductReviews(
  product: RequiredColumns<Product, 'id'>,
): DatabaseView<Review[]> {
  return view(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getProductReviewsByUser(
  reviewer: RequiredColumns<User, 'id'>,
  product: RequiredColumns<Product, 'id'>,
): DatabaseView<Review[]> {
  return view(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('product_id', product.id)
      .eq('created_by_id', reviewer.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getSellerReviews(
  seller: RequiredColumns<User, 'id'>,
): DatabaseView<Review[]> {
  return view(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('created_on_id', seller.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getSellerReviewsByUser(
  reviewer: RequiredColumns<User, 'id'>,
  seller: RequiredColumns<User, 'id'>,
): DatabaseView<Review[]> {
  return view(
    await supabase
      .from('Reviews')
      .select('*')
      .eq('created_by_id', reviewer.id)
      .eq('created_on_id', seller.id)
      .order('created_at', { ascending: false }),
  );
}

export async function getAverageProductRating(
  product: RequiredColumns<Product, 'id'>,
): DatabaseQuery<Review, 'product_id' | 'rating'> {
  return query(
    await supabase
      .from('Reviews')
      .select('product_id,rating:rating.ave()')
      .eq('product_id', product.id)
      .single(),
  );
}

export async function getAverageSellerRating(
  seller: RequiredColumns<User, 'id'>,
): DatabaseQuery<Review, 'created_on_id' | 'rating'> {
  return query(
    await supabase
      .from('Reviews')
      .select('created_on_id,rating:rating.ave()')
      .eq('created_on_id', seller.id)
      .single(),
  );
}

export function create(reviewer: RequiredColumns<User, 'id'>): ReviewPublisher {
  const review: Partial<Review> = {};
  return {
    description(description: string): Result<ReviewPublisher, Error> {
      if (!description) {
        return err(new Error('Review description is not specified'));
      } else {
        review.description = description;
      }

      return ok(this);
    },
    rating(rating: number): Result<ReviewPublisher, Error> {
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
            created_by_id: reviewer.id,
          })
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
