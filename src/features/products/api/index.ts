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

export async function get(
  id: number,
  columns: string,
): DatabaseQuery<ProductTable> {
  return query(await supabase
    .from('Product_Information')
    .select(columns as '*')
    .eq('id', id)
    .single());
}

export async function getBySeller(
  seller: PickOmit<User, 'id'>,
  columns: string,
): DatabaseQuery<ProductTable[]> {
  return query(await supabase
    .from('Product_Information')
    .select(columns as '*')
    .eq('user_id', seller.id));
}

export async function add(
  product: Required<ProductTable>,
): DatabaseQuery<ProductTable> {
  return query(await supabase
    .from('Product_Information')
    .insert(product)
    .select()
    .single());
}

export async function remove(product: Required<ProductTable>): DatabaseQuery<ProductTable> {
  return query(await supabase
    .from('Product_Information')
    .delete()
    .eq('id', product.id)
    .select()
    .single());
}

export async function update(
  product: Partial<ProductTable>,
): DatabaseQuery<ProductTable> {
  return query(await supabase
    .from('Product_Information')
    .update(product)
    .select()
    .single());
}

export async function categorize(product: PickOmit<ProductTable, 'id'>, ...categories: PickOmit<CategoryTagTable, 'id'>[]): DatabaseQuery<CategoryAssignedProductTable[]> {
  const id = product.id;
  const existing = query(await supabase
    .from('Category_Assigned_Products')
    .delete()
    .eq('product_id', id));

  if (!existing.ok) {
    return existing;
  }

  return query(await supabase
    .from('Category_Assigned_Products')
    .insert(categories.map((category) => ({
      category_id: category.id,
      product_id: id,
    })))
    .select());
}

export async function getCategories(product: PickOmit<ProductTable, 'id'>): DatabaseQuery<CategoryAssignedProductTable[]> {
  return query(await supabase
    .from('Category_Assigned_Products')
    .select('*')
    .eq('product_id', product.id));
}

/*
/!**
 * @param keywords the search keywords
 * @param filters the unique filters that narrows results
 *!/
export async function getProductsByKeywords(
  keywords: string[],
  filters: ProductFilter[],
  columns: string,
): DatabaseQueryResult<ProductTable[]> {
  const { data, error } = await supabase
    .from('Product_Information')
    .select(columns as '*');

  return error ? err(error) : ok(data);
}
*/
