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

/**
 * See the implementation below for more information.
 */
interface UserReviewing {
  /**
   * Retrieves product reviews by the given product.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product reviews
   */
  getProductReviews: (
    product: RequiredColumns<Product, 'id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves product reviews made for the given product by the given reviewer.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param reviewer the given user identifier
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product reviews
   */
  getProductReviewByReviewer: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    product: RequiredColumns<Product, 'id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves seller reviews by the given seller.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller reviews
   */
  getSellerReviews: (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves seller reviews made for the given seller by the given reviewer.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param reviewer the given user identifier
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller reviews
   */
  getSellerReviewByReviewer: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves the average rating of the given product.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product rating
   */
  getAverageProductRating: (
    product: RequiredColumns<Product, 'id'>,
  ) => DatabaseQuery<Review, 'id' | 'rating'>;

  /**
   * Retrieves the average rating of the given seller.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller rating
   */
  getAverageSellerRating: (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review, 'id' | 'rating'>;

  /**
   * Publishes a review made by the reviewer.
   *
   * @see {@link ReviewPublisher} for more information on its builder features
   *
   * @param reviewer the given user identifier
   * @returns the review publisher
   */
  create: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => ReviewPublisher;

  /**
   * Removes the given review from the reviewer.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param reviewer the user identifier
   * @param reviews the review identifier
   * @returns a promise that resolves to the corresponding deleted reviews
   */
  remove: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    reviews: RequiredColumns<Review, 'id'>[],
  ) => DatabaseQuery<Review[], 'id'>;

  /**
   * Modifies the given review from the reviewer with a new rating and/or description.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param reviewer the user identifier
   * @param review the review identifier
   * @returns a promise that resolves to the corresponding modified reviews
   */
  modify: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    review: RequiredColumns<Review, 'id' | 'rating' | 'description'>,
  ) => DatabaseQuery<Review, 'id'>;
}

/**
 * The user reviewing feature is used to write and post user reviews based on their product experience.
 * - Users must give a review rating and description to publish their reviews.
 * - Users must also own the product (verified) to publish their review.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
export const UserReviewing: UserReviewing = {
  getProductReviews: async (
    product: RequiredColumns<Product, 'id'>,
  ): DatabaseQuery<Review[], '*'> => {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false }),
    );
  },
  getProductReviewByReviewer: async (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    product: RequiredColumns<Product, 'id'>,
  ): DatabaseQuery<Review[], '*'> => {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('created_by_id', reviewer.supabase_id)
        .order('created_at', { ascending: false })
        .single(),
    );
  },
  getSellerReviews: async (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review[], '*'> => {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('created_on_id', seller.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  getSellerReviewByReviewer: async (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review[], '*'> => {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('created_by_id', reviewer.supabase_id)
        .eq('created_on_id', seller.supabase_id)
        .order('created_at', { ascending: false })
        .single(),
    );
  },
  getAverageProductRating: async (
    product: RequiredColumns<Product, 'id'>,
  ): DatabaseQuery<Review, 'id' | 'rating'> => {
    return query(
      await supabase
        .from('Reviews')
        .select('product_id,rating:rating.ave()')
        .eq('product_id', product.id)
        .single(),
    );
  },
  getAverageSellerRating: async (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review, 'id' | 'rating'> => {
    return query(
      await supabase
        .from('User_Information')
        .select('rating')
        .eq('supabase_id', seller.supabase_id)
        .single(),
    );
  },
  create: (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
  ): ReviewPublisher => {
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
  },
  remove: async (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    reviews: RequiredColumns<Review, 'id'>[],
  ): DatabaseQuery<Review[], 'id'> => {
    return query(
      await supabase
        .from('Reviews')
        .delete()
        .eq('created_by_id', reviewer.supabase_id)
        .in(
          'id',
          reviews.map((review) => review.id),
        )
        .select(),
    );
  },
  modify: async (
    reviewer: RequiredColumns<UserProfile, 'supabase_id'>,
    review: RequiredColumns<Review, 'id' | 'rating' | 'description'>,
  ): DatabaseQuery<Review, 'id'> => {
    return query(
      await supabase
        .from('Reviews')
        .update(review)
        .eq('id', review.id)
        .eq('reviewer', reviewer.supabase_id)
        .select('id')
        .single(),
    );
  },
};
