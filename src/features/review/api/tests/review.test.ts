import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { ReviewAPI } from '@features/review';

describe('Review Creation/Modification', () => {
  it('creates a review', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const create = ReviewAPI.create(reviewer);

    const validDescription = 'this is a description';
    const validDescriptionResult = create.description(validDescription);

    expect(validDescriptionResult.ok, 'create.description() invalid').toBe(true);

    const invalidDescription = '';
    const invalidDescriptionResult = create.description(invalidDescription);

    expect(invalidDescriptionResult.ok, 'create.description() valid').toBe(false);

    const validRating = 3.5;
    const validRatingResult = create.rating(validRating);

    expect(validRatingResult.ok, 'create.rating() invalid').toBe(true);

    const invalidNegativeRating = -1;
    const invalidNegativeRatingResult = create.rating(invalidNegativeRating);

    expect(invalidNegativeRatingResult.ok, 'create.rating() valid').toBe(false);

    const invalidOverMaxRating = 6;
    const invalidOverMaxRatingResult = create.rating(invalidOverMaxRating);

    expect(invalidOverMaxRatingResult.ok, 'create.rating() valid').toBe(false);

    const publish = create.publish();
    const result = await publish;

    expect(result.ok, 'create.publish() failed').toBe(true);
  });

  it('removes reviews', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const reviews = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ReviewAPI.remove(reviewer, ...reviews);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('update a review', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const review = {
      id: 0,
      rating: 4.5,
      description: 'this is good',
    };

    const query = ReviewAPI.remove(reviewer, review);
    const result = await query;

    expect(result.ok, 'update() failed').toBe(true);
  });
});

describe('Product Review', () => {
  it('returns product reviews', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const product = { id: 0 };
    const query = ReviewAPI.getProductReviews(product);
    const result = await query;

    expect(result.ok, 'getProductReviews() failed').toBe(true);
  });

  it('returns product reviews from reviewer', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const product = { id: 0 };
    const query = ReviewAPI.getProductReviewsByReviewer(reviewer, product);
    const result = await query;

    expect(result.ok, 'getProductReviewsByReviewer() failed').toBe(true);
  });

  it('returns an average product rating', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const product = { id: 0 };
    const query = ReviewAPI.getAverageProductRating(product);
    const result = await query;

    expect(result.ok, 'getAverageProductRating() failed').toBe(true);
  });
});

describe('Seller Review', () => {
  it('returns seller reviews', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const seller = { supabase_id: 'abc123' };
    const query = ReviewAPI.getSellerReviews(seller);
    const result = await query;

    expect(result.ok, 'getSellerReviews() failed').toBe(true);
  });

  it('returns seller reviews from reviewer', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const seller = { supabase_id: '123zxcv' };
    const query = ReviewAPI.getSellerReviewsByReviewer(reviewer, seller);
    const result = await query;

    expect(result.ok, 'getSellerReviewsByReviewer() failed').toBe(true);
  });

  it('returns an average seller rating', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const seller = { supabase_id: 'abc123' };
    const query = ReviewAPI.getAverageSellerRating(seller);
    const result = await query;

    expect(result.ok, 'getAverageSellerRating() failed').toBe(true);
  });
});

