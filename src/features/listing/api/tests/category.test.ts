import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { ListingCategoryAPI } from '@features/listing';

describe('Category Creation/Modification', () => {
  it('creates a category tag', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      }),
    });

    const category = {
      name: 'Textbooks',
      description: 'School textbooks',
    };

    const query = ListingCategoryAPI.register(category);
    const result = await query;

    expect(result.ok, 'register()').toBe(true);
  });

  it('removes category tags', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const categories = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ListingCategoryAPI.remove(...categories);
    const result = await query;

    expect(result.ok, 'remove()').toBe(true);
  });

  it('sets/changes a category tag', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: {}, error: null }),
          }),
        }),
      }),
    });

    const old = { id: 0 };
    const change = {
      name: 'Notes',
      description: 'Student notes',
    };

    const query = ListingCategoryAPI.set(old, change);
    const result = await query;

    expect(result.ok, 'set()').toBe(true);
  });
});

describe('Category Tagging', () => {
  it('tags product', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const product = { id: 0 };
    const categories = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ListingCategoryAPI.tag(product, ...categories);
    const result = await query;

    expect(result.ok, 'tag()').toBe(true);
  });
});