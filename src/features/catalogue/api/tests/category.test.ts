import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { CategoryCatalogueAPI } from '@features/catalogue';

describe('Category Tag Catalogue', () => {
  it('returns all category tags', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        order: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const query = CategoryCatalogueAPI.getTags();
    const result = await query;

    expect(result.ok, 'getTags()').toBe(true);
  });

  it('returns a category tag by its id', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const category = { id: 0 };
    const query = CategoryCatalogueAPI.getTag(category);
    const result = await query;

    expect(result.ok, 'getTag()').toBe(true);
  });

  it('returns products assigned with a category tag', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const category = { id: 0 };
    const query = CategoryCatalogueAPI.getProductsByAssignedTag(category);
    const result = await query;

    expect(result.ok, 'getProductsByAssignedTag()').toBe(true);
  });

  it('returns assigned category tags by a given product', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const product = { id: 0 };
    const query = CategoryCatalogueAPI.getAssignedTagsByProduct(product);
    const result = await query;

    expect(result.ok, 'getAssignedTagsByProduct()').toBe(true);
  });
});
