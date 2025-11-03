import { supabase } from '@shared/api';
import type {
  DatabaseQueryArray,
  DatabaseView,
  Product,
  Result,
} from '@shared/types';
import { err, ok } from '@shared/utils';
import type { ProductFilter } from '@features/catalogue';
import { query } from '@shared/api/database.ts';

export async function get(id: number): DatabaseView<Product> {
  return query(
    await supabase
      .from('Product_Information')
      .select('*')
      .eq('id', id)
      .single(),
  );
}

export async function getAll(columns: string): DatabaseView<Product[]> {
  return query(
    await supabase.from('Product_Information').select(columns as '*'),
  );
}

export async function getBySearch(
  text: string,
): DatabaseQueryArray<Product, 'id'> {
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
    async find(): DatabaseQueryArray<Product, 'id'> {
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
