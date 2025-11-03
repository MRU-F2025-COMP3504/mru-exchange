import { err, ok } from '@shared/utils';
import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  DatabaseQueryArray,
  PickOmit,
  Product,
  Result,
} from '@shared/types';
import { supabase } from '@shared/api';
import type { ProductAttributeModifier } from '@features/listing';
import type { ProductBuilder } from '@features/listing/types';
import { query } from '@shared/api/database.ts';

export function register(): ProductBuilder {
  const product: Partial<Product> = {};
  return {
    seller(id: string): Result<ProductBuilder, Error> {
      if (!id) {
        return err(new Error('Product ID is not specified'));
      } else {
        product.user_id = id;
      }

      return ok(this);
    },
    title(title: string): Result<ProductBuilder, Error> {
      return setTitle(this, product, title);
    },
    description(description: string): Result<ProductBuilder, Error> {
      return setDescription(this, product, description);
    },
    image(url: string): Result<ProductBuilder, Error> {
      return setImage(this, product, url);
    },
    price(price: number): Result<ProductBuilder, Error> {
      if (price < 0) {
        return err(
          new Error('Product price cannot be negative', { cause: price }),
        );
      } else {
        product.price = price;
      }

      return ok(this);
    },
    stock(stock: number): Result<ProductBuilder, Error> {
      if (stock < 0) {
        return err(
          new Error('Product stock cannot be negative', { cause: stock }),
        );
      } else {
        product.stock_count = stock;
      }

      return ok(this);
    },
    async build(): DatabaseQuery<Product, 'id'> {
      return query(
        await supabase
          .from('Product_Information')
          .insert(product)
          .select('id')
          .single(),
      );
    },
  };
}

export async function set(product: PickOmit<Product, 'id'>, isListed: boolean): DatabaseQuery<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .eq('id', product.id)
      .select('id')
      .single(),
  );
}

export async function setAll(seller: string, isListed: boolean): DatabaseQueryArray<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .eq('user_id', seller)
      .eq('isListed', !isListed)
      .select('id'),
  );
}

export async function remove(product: PickOmit<Product, 'id'>): DatabaseQuery<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('id', product.id)
      .select('id')
      .single(),
  );
}

export async function removeAll(seller: string): DatabaseQueryArray<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('user_id', seller)
      .select('id'),
  );
}

export function attribute(product: PickOmit<Product, 'id'>): ProductAttributeModifier {
  const change: Partial<Product> = {};

  return {
    title(title: string): Result<ProductAttributeModifier, Error> {
      return setTitle(this, product, title);
    },
    description(description: string): Result<ProductAttributeModifier, Error> {
      return setDescription(this, product, description)
    },
    image(url: string): Result<ProductAttributeModifier, Error> {
      return setImage(this, product, url);
    },
    async modify(): DatabaseQuery<Product, 'id'> {
      return query(
        await supabase
          .from('Product_Information')
          .update(change)
          .eq('id', product.id)
          .select('id')
          .single(),
      );
    },
  }
}

export async function stock(product: PickOmit<Product, 'id'>, stock: number): DatabaseQuery<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        stock_count: stock,
      })
      .eq('id', product.id)
      .select()
      .single(),
  );
}

export async function categorize(
  product: PickOmit<Product, 'id'>,
  ...categories: PickOmit<Category, 'id'>[]
): DatabaseQueryArray<CategorizedProduct, 'category_id'> {
  const id = product.id;
  const existing = query(
    await supabase
      .from('Category_Assigned_Products')
      .delete()
      .eq('product_id', id),
  );

  if (existing.ok) {
    return query(
      await supabase
        .from('Category_Assigned_Products')
        .insert(
          categories.map((category) => ({
            category_id: category.id,
            product_id: id,
          })),
        )
        .select('category_id'),
    );
  }

  return existing;
}

function setTitle<T>(controller: T, product: Partial<Product>, title: string): Result<T, Error> {
  if (!title) {
    return err(new Error('Product title is not specified'));
  } else {
    product.title = title;
  }

  return ok(controller);
}

function setDescription<T>(controller: T, product: Partial<Product>, description: string): Result<T, Error> {
  if (!description) {
    return err(new Error('Product description is not specified'));
  } else {
    product.description = description;
  }

  return ok(controller);
}

function setImage<T>(controller: T, product: Partial<Product>, url: string): Result<T, Error> {
  try {
    product.image = new URL(url).toJSON();
  } catch (error: unknown) {
    product.image = null;

    if (error instanceof Error) {
      return err(error);
    }
  }

  return ok(controller);
}