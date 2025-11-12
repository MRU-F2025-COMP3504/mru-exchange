import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { CartAPI } from '@features/ordering';

describe('Shopping Cart', () => {
  it('returns the cart of user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: {}, error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = CartAPI.get(user);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns the products from cart', async () => {
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
    const query = CartAPI.getProducts(cart);
    const result = await query;

    expect(result.ok, 'getProducts() failed').toBe(true);
  });

  it('registers a new cart for user', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = CartAPI.register(user);
    const result = await query;

    expect(result.ok, 'register() failed').toBe(true);
  });

  it('store products to cart', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockReturnValue({ data: new Array<object>(), error: null }),
      }),
    });

    const cart = { id: 0 };
    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = CartAPI.store(cart, ...products);
    const result = await query;

    expect(result.ok, 'store() failed').toBe(true);
  });

  it('remove products from cart', async () => {
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
    const query = CartAPI.remove(cart, ...products);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('clear products from cart', async () => {
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
    const query = CartAPI.clear(cart);
    const result = await query;

    expect(result.ok, 'clear() failed');
  });
});
