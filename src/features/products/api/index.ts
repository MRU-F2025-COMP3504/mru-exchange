import { supabase } from '@shared/api';
import type {
  CategoryAssignedProductTable,
  CategoryTagTable,
  DatabaseQuery,
  PickOmit,
  ProductTable,
} from '@shared/types';
import { query } from '@shared/utils';
import type { User } from '@supabase/supabase-js';
import type { ProductFilter } from '@features/products';

export async function get(
  id: number,
  columns: string,
): DatabaseQuery<ProductTable> {
  return query(
    await supabase
      .from('Product_Information')
      .select(columns as '*')
      .eq('id', id)
      .single(),
  );
}

export async function getBySeller(
  seller: PickOmit<User, 'id'>,
  columns: string,
): DatabaseQuery<ProductTable[]> {
  return query(
    await supabase
      .from('Product_Information')
      .select(columns as '*')
      .eq('user_id', seller.id),
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

export async function getByFilter(
  product: Partial<ProductFilter>,
): DatabaseQuery<PickOmit<ProductTable, 'id'>[]> {
  const sql = supabase.from('Product_Information').select('id');

  if (product.seller) {
    sql.eq('user_id', product.seller);
  }

  if (product.price) {
    sql.gte('price', product.price.min);
    sql.lte('price', product.price.max);
  }

  if (product.stock) {
    sql.gte('stock_count', product.stock.min);
    sql.lte('stock_count', product.stock.max);
  }

  if (product.listed) {
    sql.eq('isListed', product.listed);
  }

  const products = query(await sql);

  if (products.ok && product.categories) {
    const sql = supabase
      .from('Category_Assigned_Products')
      .select('id:product_id');

    for (const category of product.categories) {
      sql.eq('category_id', category);
    }

    for (const product of products.data) {
      sql.eq('product_id', product.id);
    }

    return query(await sql);
  }

  return products;
}

export async function add(
  product: Required<ProductTable>,
): DatabaseQuery<ProductTable> {
  return query(
    await supabase
      .from('Product_Information')
      .insert(product)
      .select()
      .single(),
  );
}

export async function remove(
  product: Required<ProductTable>,
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