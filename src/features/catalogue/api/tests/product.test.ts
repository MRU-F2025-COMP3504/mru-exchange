import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { ProductCatalogueAPI } from '@features/catalogue';

describe('Product Catalogue', () => {
  it('returns products', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        in: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ProductCatalogueAPI.get(...products);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns products by seller', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const seller = { supabase_id: 'abc123' };
    const query = ProductCatalogueAPI.getBySeller(seller);
    const result = await query;

    expect(result.ok, 'getBySeller() failed').toBe(true);
  });

  it('returns products by search query', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const text = 'abc textbook';
    const query = ProductCatalogueAPI.getBySearch(text);
    const result = await query;

    expect(result.ok, 'getBySearch() failed').toBe(true);
  });

  it('returns products by filter', async () => {
    const success = { data: new Array<object>(), error: null };

    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            lte: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockResolvedValue(success),
              }),
            }),
          }),
        }),
      }),
    });

    const seller = { supabase_id: 'abc123' };
    const sellerFilter = ProductCatalogueAPI.getByFilter().seller(seller);

    if (sellerFilter.ok) {
      const invalidSeller = { supabase_id: '' };
      const failedSellerFilter = sellerFilter.data.seller(invalidSeller);

      expect(failedSellerFilter.ok, 'getByFilter.seller() valid').toBe(false);

      const priceFilter = sellerFilter.data.price(123, 500);

      if (priceFilter.ok) {
        const failedPriceFilter = priceFilter.data.price(-1, -2);

        expect(failedPriceFilter.ok, 'getByFilter.price() valid').toBe(false);

        const stockFilter = priceFilter.data.stock(1, 20);

        if (stockFilter.ok) {
          const failedStockFilter = stockFilter.data.price(-1, -2);

          expect(failedStockFilter.ok, 'getByFilter.stock() valid').toBe(false);

          const uncategorizedProductsQuery = stockFilter.data.find();
          const uncategorizedProductsResult = await uncategorizedProductsQuery;

          expect(
            uncategorizedProductsResult.ok,
            'getByFilter.find() invalid',
          ).toBe(true);

          const categoryFilter = stockFilter.data.categories(0, 1, 2, 3, 4, 5);

          if (categoryFilter.ok) {
            mockQuery({
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockReturnValue({
                  in: vi.fn().mockResolvedValue(success),
                }),
              }),
            });

            const categorizedProductsQuery = categoryFilter.data.find();
            const categorizedProductsResult = await categorizedProductsQuery;

            expect(
              categorizedProductsResult.ok,
              'getByFilter.find() invalid',
            ).toBe(true);
          }

          expect(categoryFilter.ok, 'getByFilter.category() invalid').toBe(
            true,
          );
        }

        expect(stockFilter.ok, 'getByFilter.stock() invalid').toBe(true);
      }

      expect(priceFilter.ok, 'getByFilter.price() invalid').toBe(true);
    }

    expect(sellerFilter.ok, 'getByFilter.seller() invalid').toBe(true);
  });
});
