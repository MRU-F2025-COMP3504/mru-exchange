import { err, ok, query } from '@shared/utils';
import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  PickOmit,
  Product,
  Result,
} from '@shared/types';
import { supabase } from '@shared/api';
import type { ProductAttributeModifier } from '@features/listing';
import type { ProductBuilder } from '@features/catalogue';

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
    async build<T extends PickOmit<Product, 'id'>>(): DatabaseQuery<T> {
      return query(
        await supabase
          .from('Product_Information')
          .insert(product)
          .select()
          .single(),
      );
    },
  };
}

export async function set<T extends PickOmit<Product, 'id'>>(product: T, isListed: boolean): DatabaseQuery<T> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .eq('id', product.id)
      .select()
      .single(),
  );
}

export async function setAll<T extends PickOmit<Product, 'id'>>(seller: string, isListed: boolean): DatabaseQuery<T[]> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .eq('user_id', seller)
      .eq('isListed', !isListed)
      .select(),
  );
}

export async function remove<T extends PickOmit<Product, 'id'>>(product: T): DatabaseQuery<T> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('id', product.id)
      .select()
      .single(),
  );
}

export async function removeAll<T extends PickOmit<Product, 'id'>>(seller: string): DatabaseQuery<T[]> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('user_id', seller)
      .select(),
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
    async modify<T extends PickOmit<Product, 'id'>>(): DatabaseQuery<T> {
      return query(
        await supabase
          .from('Product_Information')
          .update(change)
          .eq('id', product.id)
          .select()
          .single(),
      );
    },
  }
}

export async function stock<T extends PickOmit<Product, 'id'>>(product: T, stock: number): DatabaseQuery<T> {
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
): DatabaseQuery<CategorizedProduct[]> {
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
        .select(),
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