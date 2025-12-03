import type { ReviewPublisher } from '@features/review';
import { supabase } from '@shared/api';
import type {
  DatabaseQuery,
  Product,
  RequireProperty,
  Result,
  Review,
  UserProfile,
} from '@shared/types';
import { err, FormUtils, ok, query } from '@shared/utils';

/**
 * See the implementation below for more information.
 */
interface UserReviewing {
  /**
   * Retrieves product reviews by the given product.
   * Selects all columns.
   *
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product reviews
   */
  getProductReviews: (
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves product reviews made for the given product by the given reviewer.
   * Selects all columns.
   *
   * @param reviewer the given user identifier
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product reviews
   */
  getProductReviewByReviewer: (
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves seller reviews by the given seller.
   * Selects all columns.
   *
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller reviews
   */
  getSellerReviews: (
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves seller reviews made for the given seller by the given reviewer.
   * Selects all columns.
   *
   * @param reviewer the given user identifier
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller reviews
   */
  getSellerReviewByReviewer: (
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review[], '*'>;

  /**
   * Retrieves the average rating of the given product.
   *
   * @param product the given product identifier
   * @returns a promise that resolves to the corresponding product rating
   */
  getAverageProductRating: (
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<Review, 'id' | 'rating'>;

  /**
   * Retrieves the average rating of the given seller.
   *
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding seller rating
   */
  getAverageSellerRating: (
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Review, 'id' | 'rating'>;

  /**
   * Publishes a review made by the reviewer.
   *
   * @param reviewer the given user identifier
   * @returns the review publisher
   * @see {@link ReviewPublisher} for more information on its builder features
   */
  create: (
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    target?: RequireProperty<UserProfile, 'supabase_id'>,
  ) => ReviewPublisher;

  /**
   * Removes the given review from the reviewer.
   *
   * @param reviewer the user identifier
   * @param reviews the review identifier
   * @returns a promise that resolves to the corresponding deleted reviews
   */
  remove: (
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    reviews: RequireProperty<Review, 'id'>[],
  ) => DatabaseQuery<Review[], 'id'>;

  /**
   * Modifies the given review from the reviewer with a new rating and/or description.
   *
   * @param reviewer the user identifier
   * @param review the review identifier
   * @returns a promise that resolves to the corresponding modified reviews
   */
  modify: (
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    review: RequireProperty<Review, 'id' | 'rating' | 'description'>,
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
  async getProductReviews(
    product: RequireProperty<Product, 'id'>,
  ): DatabaseQuery<Review[], '*'> {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false }),
    );
  },
  async getProductReviewByReviewer(
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    product: RequireProperty<Product, 'id'>,
  ): DatabaseQuery<Review[], '*'> {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('created_by_id', reviewer.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  async getSellerReviews(
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review[], '*'> {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('created_on_id', seller.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  async getSellerReviewByReviewer(
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review[], '*'> {
    return query(
      await supabase
        .from('Reviews')
        .select('*')
        .eq('created_by_id', reviewer.supabase_id)
        .eq('created_on_id', seller.supabase_id)
        .order('created_at', { ascending: false }),
    );
  },
  async getAverageProductRating(
    product: RequireProperty<Product, 'id'>,
  ): DatabaseQuery<Review, 'id' | 'rating'> {
    return query(
      await supabase
        .from('Reviews')
        .select('product_id,rating:rating.ave()')
        .eq('product_id', product.id)
        .single(),
    );
  },
  async getAverageSellerRating(
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Review, 'id' | 'rating'> {
    return query(
      await supabase
        .from('User_Information')
        .select('rating')
        .eq('supabase_id', seller.supabase_id)
        .single(),
    );
  },
  create(
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    target?: RequireProperty<UserProfile, 'supabase_id'>,
  ): ReviewPublisher {
    const review: Partial<Review> = {};

    return {
      description(form: FormData, key = 'description'): Result<string> {
        const { data, error } = FormUtils.getString(form, key);

        if (error) {
          return err('Invalid review description', error);
        } else if (!data) {
          return err('Description cannot be empty');
        } else {
          return ok((review.description = data));
        }
      },
      rating(form: FormData, key = 'rating'): Result<number> {
        const { data, error } = FormUtils.getString(form, key);

        if (error) {
          return err('Invalid review rating', error);
        } else if (!data) {
          return err('Rating cannot be empty');
        } else {
          const rating = +data;

          if (rating < 0) {
            return err('Rating cannot be negative', rating);
          } else if (rating > 5) {
            return err('Rating cannot exceed score limit', rating);
          }

          return ok((review.rating = rating));
        }
      },
      isSatisfied(): boolean {
        if (!review.description) {
          return false;
        } else if (!review.rating) {
          return false;
        }

        return true;
      },
      async submit(): DatabaseQuery<Review, '*'> {
        return query(
          await supabase
            .from('Reviews')
            .insert({
              ...review,
              created_by_id: reviewer.supabase_id,
              ...(target && { created_on_id: target.supabase_id }),
            } as Review)
            .select()
            .single(),
        );
      },
    };
  },
  async remove(
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    reviews: RequireProperty<Review, 'id'>[],
  ): DatabaseQuery<Review[], 'id'> {
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
  async modify(
    reviewer: RequireProperty<UserProfile, 'supabase_id'>,
    review: RequireProperty<Review, 'id' | 'rating' | 'description'>,
  ): DatabaseQuery<Review, 'id'> {
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
