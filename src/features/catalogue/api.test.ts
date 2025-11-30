import { describe, it, vi, expect } from 'vitest';
import { mockQuery } from '@shared/utils';
import { CategoryCatalogue, ProductCatalogue } from '@features/catalogue';

describe('Category Tag Catalogue', () => {
  it('returns all category tags', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        order: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const query = CategoryCatalogue.getTags();
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
    const query = CategoryCatalogue.getTag(category);
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
    const query = CategoryCatalogue.getProductsByAssignedTag(category);
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
    const query = CategoryCatalogue.getAssignedTagsByProduct(product);
    const result = await query;

    expect(result.ok, 'getAssignedTagsByProduct()').toBe(true);
  });
});

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
    const query = ProductCatalogue.get(products);
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
    const query = ProductCatalogue.getBySeller(seller);
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
    const query = ProductCatalogue.getBySearch(text);
    const result = await query;

    expect(result.ok, 'getBySearch() failed').toBe(true);
  });

  it('returns products by filter', () => {
    const filter = ProductCatalogue.getByFilter();
    const form = new FormData();

    expect(
      filter.seller({ supabase_id: 'abc123' }).ok,
      'getByFilter.seller() invalid()',
    ).toBe(true);

    expect(
      filter.seller({ supabase_id: '' }).ok,
      'getByFilter.seller() valid()',
    ).toBe(false);

    form.append('categories', '0');
    form.append('categories', '1');
    form.append('categories', '2');

    expect(
      filter.categories(form).ok,
      'getByFilter.categories() invalid()',
    ).toBe(true);

    form.set('categories', '');

    expect(filter.categories(form).ok, 'getByFilter.categories() valid').toBe(
      false,
    );

    form.set('categories', '-1');

    expect(filter.categories(form).ok, 'getByFilter.categories() valid').toBe(
      false,
    );

    form.set('min-price', '0');
    form.set('max-price', '5');

    const validPrice = filter.price(form);

    expect(
      validPrice[0].ok && validPrice[1].ok,
      'getByFilter.price() invalid()',
    ).toBe(true);

    form.set('min-stock', '0');
    form.set('max-stock', '9');

    const validStock = filter.stock(form);

    expect(
      validStock[0].ok && validStock[1].ok,
      'getByFilter.stock() invalid()',
    ).toBe(true);

    form.set('min-price', '-5');
    form.set('max-price', '5');

    const invalidPrice = filter.price(form);

    expect(
      invalidPrice[0].ok && invalidPrice[1].ok,
      'getByFilter.price() valid()',
    ).toBe(false);

    form.set('min-stock', '3');
    form.set('max-stock', '-9');

    const invalidStock = filter.stock(form);

    expect(
      invalidStock[0].ok && invalidStock[1].ok,
      'getByFilter.stock() valid()',
    ).toBe(false);
  });
});
