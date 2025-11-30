import { describe, it, vi, expect } from 'vitest';
import { err, mockQuery } from '@shared/utils';
import { CategoryListing, ProductListing } from '@features/listing';

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

    const query = CategoryListing.create(category);
    const result = await query;

    expect(result.ok, 'register()').toBe(true);
  });

  it('removes category tags', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const categories = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = CategoryListing.remove(categories);
    const result = await query;

    expect(result.ok, 'remove()').toBe(true);
  });

  it('modifies a category tag', async () => {
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

    const query = CategoryListing.modify(old, change);
    const result = await query;

    expect(result.ok, 'set()').toBe(true);
  });
});

describe('Category Tagging', () => {
  it('tags product', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockResolvedValue({ data: new Array<object>(), error: null }),
      }),
    });

    const product = { id: 0 };
    const categories = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = CategoryListing.tag(product, categories);
    const result = await query;

    expect(result.ok, 'tag()').toBe(true);
  });
});

describe('Product Listing', () => {
  it('registers a product', () => {
    const create = ProductListing.create();
    const form = new FormData();

    form.set('title', '123abc');

    expect(create.title(form).ok, 'create.title() invalid').toBe(true);

    form.set('title', '');

    expect(create.title(form).ok, 'create.title() valid').toBe(false);

    form.set('description', '123abc');

    expect(create.description(form).ok, 'create.description() invalid').toBe(
      true,
    );

    form.set('description', '');

    expect(create.description(form).ok, 'create.description() valid').toBe(
      false,
    );

    form.append(
      'images',
      new File([], 'img1.jpg', {
        type: 'image/jpeg',
      }),
    );
    form.append(
      'images',
      new File([], 'img2.jpg', {
        type: 'image/jpeg',
      }),
    );
    form.append(
      'images',
      new File([], 'img3.jpg', {
        type: 'image/jpeg',
      }),
    );

    expect(create.images(form).ok, 'create.images() invalid').toBe(true);

    form.set(
      'images',
      new File(['12345'], 'imgx.txt', {
        type: 'image/jpeg',
      }),
    );

    expect(create.images(form).ok, 'create.images() valid').toBe(false);

    form.set('price', '690');

    expect(create.price(form).ok, 'create.price() invalid').toBe(true);

    form.set('price', '-69');

    expect(create.price(form).ok, 'create.price() valid').toBe(false);

    form.set('stock', '420');

    expect(create.stock(form).ok, 'create.stock() invalid').toBe(true);

    form.set('stock', '-69');

    expect(create.stock(form).ok, 'create.stock() valid').toBe(false);
  });

  it('puts products to listing', async () => {
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
    const query = ProductListing.list(isListed, products);
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
    const query = ProductListing.remove(products);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('modify a product attribute', () => {
    const modifier = ProductListing.attribute({ id: 0 });
    const form = new FormData();

    form.set('title', '123abc');

    expect(modifier.title(form).ok, 'attribute.title() invalid').toBe(true);

    form.set('title', '');

    expect(modifier.title(form).ok, 'attribute.title() valid').toBe(false);

    form.set('description', '123abc');

    expect(
      modifier.description(form).ok,
      'attribute.description() invalid',
    ).toBe(true);

    form.set('description', '');

    expect(modifier.description(form).ok, 'attribute.description() valid').toBe(
      false,
    );

    form.append(
      'images',
      new File(['12345'], 'img1.jpg', {
        type: 'image/jpeg',
      }),
    );
    form.append(
      'images',
      new File(['12345'], 'img2.jpg', {
        type: 'image/jpeg',
      }),
    );
    form.append(
      'images',
      new File(['12345'], 'img3.jpg', {
        type: 'image/jpeg',
      }),
    );

    expect(modifier.images(form).ok, 'create.images() invalid').toBe(true);

    form.set(
      'images',
      new File(['12345'], 'imgx.txt', {
        type: 'image/jpeg',
      }),
    );

    expect(modifier.images(form).ok, 'create.images() valid').toBe(false);
  });

  it('change product price', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const form = new FormData();

    form.set('price', '123');

    expect(
      (await ProductListing.price({ id: 0 }, form)).ok,
      'price() invalid',
    ).toBe(true);

    form.set('price', '');

    expect(
      (await ProductListing.price({ id: 0 }, form)).ok,
      'price() valid',
    ).toBe(false);
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

    const form = new FormData();

    form.set('stock', '123');

    expect(
      (await ProductListing.stock({ id: 0 }, form)).ok,
      'stock() invalid',
    ).toBe(true);

    form.set('stock', '');

    expect(
      (await ProductListing.stock({ id: 0 }, form)).ok,
      'stock() valid',
    ).toBe(false);
  });
});
