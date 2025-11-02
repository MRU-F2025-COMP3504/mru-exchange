import { supabase } from '@shared/api';
import type {
  CategoryAssignedProductTable,
  CategoryTagTable,
  DatabaseQueryResult,
  PickOmit,
  ProductTable,
} from '@shared/types';
import { ok, err } from '@shared/utils';
import type { User } from '@supabase/supabase-js';

/**
 * @param id the product identifier
 */
export async function get(
  id: number,
  columns: string,
): DatabaseQueryResult<ProductTable> {
  const { data, error } = await supabase
    .from('Product_Information')
    .select(columns as '*')
    .eq('id', id)
    .single();

  return error ? err(error) : ok(data);
}

/**
 * @param id the seller identifier
 */
export async function getBySeller(
  seller: User,
  columns: string,
): DatabaseQueryResult<ProductTable[]> {
  const { data, error } = await supabase
    .from('Product_Information')
    .select(columns as '*')
    .eq('user_id', seller.id);

  return error ? err(error) : ok(data);
}

export async function add(
  product: Required<ProductTable>,
): DatabaseQueryResult<null> {
  const { error } = await supabase
    .from('Product_Information')
    .insert(product);

  return error ? err(new Error('Failed to add a new product')) : ok(null);
}


export async function remove(product: Required<ProductTable>): DatabaseQueryResult<null> {
  const { error } = await supabase
    .from('Product_Information')
    .delete()
    .eq('id', product.id);

  return error ? err(error) : ok(null);
}

export async function update(
  product: Partial<ProductTable>,
): DatabaseQueryResult<ProductTable> {
  const { data, error } = await supabase
    .from('Product_Information')
    .update(product)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function categorize(product: PickOmit<ProductTable, 'id'>, ...categories: PickOmit<CategoryTagTable, 'id'>[]): DatabaseQueryResult<CategoryAssignedProductTable[]> {
  const id = product.id;
  const existing = await supabase
    .from('Category_Assigned_Products')
    .delete()
    .eq('product_id', id);

  if (existing.error) {
    return err(existing.error);
  }

  const { data, error } = await supabase
    .from('Category_Assigned_Products')
    .insert(categories.map((category) => ({
      category_id: category.id,
      product_id: id,
    })))
    .select();

  return error ? err(error) : ok(data);
}

export async function getCategories(product: PickOmit<ProductTable, 'id'>): DatabaseQueryResult<CategoryAssignedProductTable[]> {
  const { data, error } = await supabase
    .from('Category_Assigned_Products')
    .select('*')
    .eq('product_id', product.id);
  return error ? err(error) : ok(data);
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
