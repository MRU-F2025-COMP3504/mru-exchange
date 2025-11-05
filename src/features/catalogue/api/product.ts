import { query, supabase } from '@shared/api';
import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  Result,
  UserProfile,
} from '@shared/types';
import { err, ok } from '@shared/utils';
import type { ProductFilter } from '@features/catalogue';

export async function get(...products: RequiredColumns<Product, 'id'>[]): DatabaseQuery<Product[], '*'> {
  return query(
    await supabase
      .from('Product_Information')
      .select('*')
      .in('id', products.map((product) => product.id))
  )
}

export async function getBySeller(seller: RequiredColumns<UserProfile, 'supabase_id'>): DatabaseQuery<Product[], '*'> {
  return query(
    await supabase
      .from('Product_Information')
      .select('*')
      .eq('user_id', seller.supabase_id)
  );
}

export async function getBySearch(
  text: string,
): DatabaseQuery<Product[], '*'> {
  const search = text.replace(/[%_\\]/g, '\\$&');
  return query(
    await supabase
      .from('Product_Information')
      .select('*')
      .or(`title.ilike.%${search}%,content.ilike.%${search}%`),
  );
}

export function getByFilter(): ProductFilter {
  const sql = supabase.from('Product_Information').select('id');
  let categories: number[];

  return {
    seller(seller: RequiredColumns<UserProfile, 'supabase_id'>): Result<ProductFilter> {
      if (!seller.supabase_id) {
        return err(new Error('Seller ID is not specified'));
      } else {
        void sql.eq('user_id', seller.supabase_id);
      }

      return ok(this);
    },
    price(a: number, b: number): Result<ProductFilter> {
      if (a < 0 || b < 0) {
        return err(
          new Error('Product price range cannot be negative', {
            cause: { a, b },
          }),
        );
      } else {
        void sql.gte('price', Math.min(a, b));
        void sql.lte('price', Math.max(a, b));
      }

      return ok(this);
    },
    stock(a: number, b: number): Result<ProductFilter> {
      if (a < 0 || b < 0) {
        return err(
          new Error('Product stock range cannot be negative', {
            cause: { a, b },
          }),
        );
      } else {
        void sql.gte('stock_count', Math.min(a, b));
        void sql.lte('stock_count', Math.max(a, b));
      }

      return ok(this);
    },
    categories(...values: number[]): Result<ProductFilter> {
      categories = values;

      return ok(this);
    },
    async find(): DatabaseQuery<Product[], 'id'> {
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
          .in('category_id', categories)
      );
    },
  };
}
