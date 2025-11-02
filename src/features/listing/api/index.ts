import { err, ok, query } from '@shared/utils';
import type {
  CategoryAssignedProductTable,
  CategoryTagTable,
  DatabaseQuery,
  PickOmit,
  ProductTable,
  Result,
} from '@shared/types';
import { supabase } from '@shared/api';
import type { ProductAttributeModifier } from '@features/listing';
import type { ProductBuilder } from '@features/catalogue';

export function register(): ProductBuilder {
  const product: Partial<ProductTable> = {};
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
      if (!title) {
        return err(new Error('Product title is not specified'));
      } else {
        product.title = title;
      }

      return ok(this);
    },
    description(description: string): Result<ProductBuilder, Error> {
      if (!description) {
        return err(new Error('Product description is not specified'));
      } else {
        product.description = description;
      }

      return ok(this);
    },
    image(url: string): Result<ProductBuilder, Error> {
      try {
        product.image = new URL(url).toJSON();
      } catch (error: unknown) {
        product.image = null;

        if (error instanceof Error) {
          return err(error);
        }
      }

      return ok(this);
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
    async build<T extends PickOmit<ProductTable, 'id'>>(): DatabaseQuery<T> {
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

export async function set<T extends PickOmit<ProductTable, 'id'>>(product: T, isListed: boolean): DatabaseQuery<T> {
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

export async function setAll<T extends PickOmit<ProductTable, 'id'>>(seller: string, isListed: boolean): DatabaseQuery<T[]> {
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

export async function remove<T extends PickOmit<ProductTable, 'id'>>(product: T): DatabaseQuery<T> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('id', product.id)
      .select()
      .single(),
  );
}

export async function removeAll<T extends PickOmit<ProductTable, 'id'>>(seller: string): DatabaseQuery<T[]> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('user_id', seller)
      .select(),
  );
}

export function attribute(product: PickOmit<ProductTable, 'id'>): ProductAttributeModifier {
  const change: Partial<ProductTable> = {};

  return {
    title(title: string): Result<ProductAttributeModifier, Error> {
      if (!title) {
        err('Product title is not specified');
      } else {
        change.title = title;
      }

      return ok(this);
    },
    description(description: string): Result<ProductAttributeModifier, Error> {
      if (!description) {
        err('Product description is not specified');
      } else {
        change.description = description;
      }

      return ok(this);
    },
    image(url: string): Result<ProductAttributeModifier, Error> {
      try {
        change.image = new URL(url).toJSON();
      } catch (error: unknown) {
        change.image = null;

        if (error instanceof Error) {
          return err(error);
        }
      }

      return ok(this);
    },
    async modify<T extends PickOmit<ProductTable, 'id'>>(): DatabaseQuery<T> {
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

export async function stock<T extends PickOmit<ProductTable, 'id'>>(product: T, stock: number): DatabaseQuery<T> {
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
  product: PickOmit<ProductTable, 'id'>,
  ...categories: PickOmit<CategoryTagTable, 'id'>[]
): DatabaseQuery<CategoryAssignedProductTable[]> {
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