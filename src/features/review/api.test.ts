import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/utils';
import { UserReviewing } from '@features/review';

describe('Review Creation/Modification', () => {
  it('creates a review', () => {
    const create = UserReviewing.create({ supabase_id: 'abc123' });
    const form = new FormData();

    form.set('description', '123abc');

    expect(create.description(form).ok, 'create.description() invalid').toBe(
      true,
    );

    form.set('description', '');

    expect(create.description(form).ok, 'create.description() valid').toBe(
      false,
    );

    form.set('rating', '3.5');

    expect(create.rating(form).ok, 'create.rating() invalid').toBe(true);

    form.set('rating', '5');

    expect(create.rating(form).ok, 'create.rating() invalid').toBe(true);

    form.set('rating', '');

    expect(create.rating(form).ok, 'create.rating() valid').toBe(false);

    form.set('rating', '-1');

    expect(create.rating(form).ok, 'create.rating() valid').toBe(false);

    form.set('rating', '5.5');

    expect(create.rating(form).ok, 'create.rating() valid').toBe(false);
  });

  it('removes reviews', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const reviews = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserReviewing.remove(reviewer, reviews);
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
    const reviews = [
      {
        id: 0,
        rating: 4.5,
        description: 'this is good',
      },
      {
        id: 1,
        rating: 4.0,
        dscruption: 'this is good too',
      },
      {
        id: 2,
        rating: 4.7,
        description: 'even better',
      },
    ];

    const query = UserReviewing.remove(reviewer, reviews);
    const result = await query;

    expect(result.ok, 'update() failed').toBe(true);
  });
});

describe('Product Review', () => {
  it('returns product reviews', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const product = { id: 0 };
    const query = UserReviewing.getProductReviews(product);
    const result = await query;

    expect(result.ok, 'getProductReviews() failed').toBe(true);
  });

  it('returns product reviews from reviewer', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const product = { id: 0 };
    const query = UserReviewing.getProductReviewByReviewer(reviewer, product);
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
    const query = UserReviewing.getAverageProductRating(product);
    const result = await query;

    expect(result.ok, 'getAverageProductRating() failed').toBe(true);
  });
});

describe('Seller Review', () => {
  it('returns seller reviews', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const seller = { supabase_id: 'abc123' };
    const query = UserReviewing.getSellerReviews(seller);
    const result = await query;

    expect(result.ok, 'getSellerReviews() failed').toBe(true);
  });

  it('returns seller reviews from reviewer', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reviewer = { supabase_id: 'abc123' };
    const seller = { supabase_id: '123zxcv' };
    const query = UserReviewing.getSellerReviewByReviewer(reviewer, seller);
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
    const query = UserReviewing.getAverageSellerRating(seller);
    const result = await query;

    expect(result.ok, 'getAverageSellerRating() failed').toBe(true);
  });
});
