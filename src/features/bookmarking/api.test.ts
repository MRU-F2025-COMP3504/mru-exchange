import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { ProductBookmarking } from '@features/bookmarking';

describe('Product Bookmarking', () => {
  it('returns the bookmarker of user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: {}, error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = ProductBookmarking.get(user);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns bookmarked products', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const cart = { id: 0 };
    const query = ProductBookmarking.getProducts(cart);
    const result = await query;

    expect(result.ok, 'getProducts() failed').toBe(true);
  });

  it('registers a bookmarker', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = ProductBookmarking.register(user);
    const result = await query;

    expect(result.ok, 'register() failed').toBe(true);
  });

  it('bookmark products', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockReturnValue({ data: new Array<object>(), error: null }),
      }),
    });

    const cart = { id: 0 };
    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ProductBookmarking.store(cart, products);
    const result = await query;

    expect(result.ok, 'store() failed').toBe(true);
  });

  it('remove bookmarked products', async () => {
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

    const cart = { id: 0 };
    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ProductBookmarking.remove(cart, products);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('remove all bookmarked products', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const cart = { id: 0 };
    const query = ProductBookmarking.clear(cart);
    const result = await query;

    expect(result.ok, 'clear() failed');
  });
});
