import { supabase } from '@shared/api';
import type {
  CategoryAssignedProductTable,
  CategoryTagTable,
  DatabaseQuery,
  PickOmit,
  ProductTable,
  Result,
} from '@shared/types';
import { err, ok, query } from '@shared/utils';
import type { ProductBuilder, ProductFilter } from '@features/products';

export async function get(
  id: number,
  columns: string,
): DatabaseQuery<Partial<ProductTable>> {
  return query(
    await supabase
      .from('Product_Information')
      .select(columns as '*')
      .eq('id', id)
      .single(),
  );
}

export async function getAll(
  columns: string,
): DatabaseQuery<Partial<ProductTable[]>> {
  return query(
    await supabase.from('Product_Information').select(columns as '*'),
  );
}

export async function getBySearch(
  text: string,
): DatabaseQuery<PickOmit<ProductTable, 'id'>[]> {
  const search = text.replace(/[%_\\]/g, '\\$&');
  return query(
    await supabase
      .from('Product_Information')
      .select('id')
      .or(`title.ilike.%${search}%,content.ilike.%${search}%`),
  );
}

export function getByFilter(): ProductFilter {
  const sql = supabase.from('Product_Information').select('id');
  let categories: number[];

  return {
    seller(id: string): Result<ProductFilter, Error> {
      if (!id) {
        return err(new Error('Product ID is not specified'));
      } else {
        sql.eq('user_id', id);
      }

      return ok(this);
    },
    price(a: number, b: number): Result<ProductFilter, Error> {
      if (a < 0 || b < 0) {
        return err(
          new Error('Product price range cannot be negative', {
            cause: { a, b },
          }),
        );
      } else {
        sql.gte('price', Math.min(a, b));
        sql.lte('price', Math.max(a, b));
      }

      return ok(this);
    },
    stock(a: number, b: number): Result<ProductFilter, Error> {
      if (a < 0 || b < 0) {
        return err(
          new Error('Product stock range cannot be negative', {
            cause: { a, b },
          }),
        );
      } else {
        sql.gte('stock_count', Math.min(a, b));
        sql.lte('stock_count', Math.max(a, b));
      }

      return ok(this);
    },
    categories(...values: number[]): Result<ProductFilter, Error> {
      categories = values;

      return ok(this);
    },
    async find(): DatabaseQuery<PickOmit<ProductTable, 'id'>[]> {
      const products = query(await sql);

      if (categories.length === 0 || !products.ok) {
        return products;
      }

      return query(
        await supabase
          .from('Category_Assigned_Products')
          .select('id:product_id')
          .in(
            'product_id',
            products.data.map((product) => product.id),
          )
          .in('category_id', categories),
      );
    },
  };
}

export function builder(): ProductBuilder {
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
    async build(): DatabaseQuery<ProductTable> {
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

export async function remove(
  product: PickOmit<ProductTable, 'id'>,
): DatabaseQuery<ProductTable> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('id', product.id)
      .select()
      .single(),
  );
}

export async function update(
  product: Partial<ProductTable>,
): DatabaseQuery<ProductTable> {
  return query(
    await supabase
      .from('Product_Information')
      .update(product)
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

  if (!existing.ok) {
    return existing;
  }

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

export async function getCategories(
  product: PickOmit<ProductTable, 'id'>,
): DatabaseQuery<CategoryAssignedProductTable[]> {
  return query(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('product_id', product.id),
  );
}
