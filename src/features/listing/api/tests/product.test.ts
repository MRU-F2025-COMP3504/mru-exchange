import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { ListingProductAPI } from '@features/listing';

describe('Product Listing', () => {
  it('registers a product', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const register = ListingProductAPI.register();

    const validSeller = { supabase_id: 'abc123' };
    const validSellerResult = register.seller(validSeller);

    expect(validSellerResult.ok, 'register.seller() invalid').toBe(true);

    const invalidSeller = { supabase_id: '' };
    const invalidSellerResult = register.seller(invalidSeller);

    expect(invalidSellerResult.ok, 'register.seller() valid').toBe(false);

    const validTitle = 'title here';
    const validTitleResult = register.title(validTitle);

    expect(validTitleResult.ok, 'register.title() invalid').toBe(true);

    const invalidTitle = '';
    const invalidTitleResult = register.title(invalidTitle);

    expect(invalidTitleResult.ok, 'register.title() valid').toBe(false);

    const validDescription = 'description here';
    const validDescriptionResult = register.description(validDescription);

    expect(validDescriptionResult.ok, 'register.description() invalid').toBe(
      true,
    );

    const invalidDescription = '';
    const invalidDescriptionResult = register.description(invalidDescription);

    expect(invalidDescriptionResult.ok, 'register.description() valid').toBe(
      false,
    );

    const validImages = [
      'database/images/test.jpg',
      'test.jpg',
      'test.png',
      'database/images/test.jpg',
      '/test/image.png',
      '/test/image.jpg',
    ];

    for (const image of validImages) {
      const validImageResult = register.image(image);

      expect(validImageResult.ok, 'register.image() invalid').toBe(true);
    }

    const invalidImage = [
      '',
      '. database/images/test.jpg',
      '$!@#,',
      'c:/',
      '.png',
      '.jpg',
    ];

    for (const image of invalidImage) {
      const invalidImageResult = register.image(image);

      expect(invalidImageResult.ok, 'register.image() valid').toBe(false);
    }

    const validPrice = 15;
    const validPriceResult = register.price(validPrice);

    expect(validPriceResult.ok, 'register.price() invalid').toBe(true);

    const invalidPrice = -1;
    const invalidPriceResult = register.price(invalidPrice);

    expect(invalidPriceResult.ok, 'register.price() valid').toBe(false);

    const validStock = 5;
    const validStockResult = register.stock(validStock);

    expect(validStockResult.ok, 'register.stock() invalid').toBe(true);

    const invalidStock = -1;
    const invalidStockResult = register.stock(invalidStock);

    expect(invalidStockResult.ok, 'register.stock() valid').toBe(false);

    const query = register.build();
    const result = await query;

    expect(result.ok, 'register.build() failed').toBe(true);
  });

  it('sets/changes products', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const isListed = true;
    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ListingProductAPI.set(isListed, ...products);
    const result = await query;

    expect(result.ok, 'set() failed').toBe(true);
  });

  it('removes products', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const products = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ListingProductAPI.remove(...products);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('change a product attribute', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const product = { id: 0 };
    const attribute = ListingProductAPI.attribute(product);

    const validTitle = 'title here';
    const validTitleResult = attribute.title(validTitle);

    expect(validTitleResult.ok, 'attribute.title() invalid').toBe(true);

    const invalidTitle = '';
    const invalidTitleResult = attribute.title(invalidTitle);

    expect(invalidTitleResult.ok, 'attribute.title() valid').toBe(false);

    const validDescription = 'description here';
    const validDescriptionResult = attribute.description(validDescription);

    expect(validDescriptionResult.ok, 'attribute.description() invalid').toBe(
      true,
    );

    const invalidDescription = '';
    const invalidDescriptionResult = attribute.description(invalidDescription);

    expect(invalidDescriptionResult.ok, 'attribute.description() valid').toBe(
      false,
    );

    const validImages = [
      'database/images/test.jpg',
      'test.jpg',
      'test.png',
      'database/images/test.jpg',
      '/test/image.png',
      '/test/image.jpg',
    ];

    for (const image of validImages) {
      const validImageResult = attribute.image(image);

      expect(validImageResult.ok, 'attribute.image() invalid').toBe(true);
    }

    const invalidImage = [
      '',
      '. database/images/test.jpg',
      '$!@#,',
      'c:/',
      '.png',
      '.jpg',
    ];

    for (const image of invalidImage) {
      const invalidImageResult = attribute.image(image);

      expect(invalidImageResult.ok, 'attribute.image() valid').toBe(false);
    }

    const query = attribute.modify();
    const result = await query;

    expect(result.ok, 'attribute() failed').toBe(true);
  });

  it('change product stock', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const product = { id: 0 };

    const stock = 5;
    const query = ListingProductAPI.stock(product, stock);
    const result = await query;

    expect(result.ok, 'stock() invalid').toBe(true);
  });
});
