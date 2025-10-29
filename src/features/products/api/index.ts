import { supabase } from '@shared/api';
import type {
  DatabaseQueryResult,
  PickOmit,
  ProductTable,
} from '@shared/types';
import { ok, err } from '@shared/utils';
import type { User } from '@supabase/supabase-js';

/**
 * @param id the product identifier
 */
export async function getProduct(
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
export async function getProductsBySeller(
  seller: User,
  columns: string,
): DatabaseQueryResult<ProductTable[]> {
  const { data, error } = await supabase
    .from('Product_Information')
    .select(columns as '*')
    .eq('user_id', seller.id);

  return error ? err(error) : ok(data);
}

export async function addProduct(
  product: Required<ProductTable>,
): DatabaseQueryResult<ProductTable> {
  const { data, error } = await supabase
    .from('Product_Information')
    .insert(product);

  if (data) {
    return ok(data);
  } else if (error) {
    return err(error);
  }

  return err(new Error('Failed to add a new product'));
}

export async function removeProduct(product: Required<ProductTable>) {
  const { data, error } = await supabase
    .from('Product_Information')
    .delete()
    .eq('id', product.id);

  return error ? err(error) : ok(data);
}

export async function updateProduct(
  product: PickOmit<ProductTable, 'id' | 'user_id'>,
) {
  const { data, error } = await supabase
    .from('Product_Information')
    .update(product);

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
