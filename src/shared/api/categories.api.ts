import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import type {
  CategoryAssignedProductTable,
  CategoryTagTable,
  DatabaseQuery,
  PickOmit,
} from '@shared/types';

export async function getAllCategories(
  columns: string,
): DatabaseQuery<CategoryTagTable[]> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .select(columns as '*')
    .order('name', { ascending: true });

  return error ? err(error) : ok(data);
}

export async function getCategory(
  id: number,
  columns: string,
): DatabaseQuery<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .select(columns as '*')
    .eq('id', id)
    .single();

  return error ? err(error) : ok(data);
}

export async function getCategoryProducts(
  id: number,
  columns: string,
): DatabaseQuery<CategoryAssignedProductTable[]> {
  const { data, error } = await supabase
    .from('Category_Assigned_Products')
    .select(columns as '*')
    .eq('category_id', id);

  return error ? err(error) : ok(data);
}

export async function getCategoryProductCount(
  id: number,
  columns: string,
): DatabaseQuery<number> {
  const { count, error } = await supabase
    .from('Category_Assigned_Products')
    .select(columns as '*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (error) {
    return err(error);
  } else if (count) {
    return ok(count);
  }

  return ok(0);
}

export async function createCategory(
  category: PickOmit<CategoryTagTable, 'name'>,
): DatabaseQuery<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .insert(category)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function updateCategory(
  category: PickOmit<CategoryTagTable, 'id'>,
): DatabaseQuery<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .update(category)
    .eq('id', category.id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteCategory(
  category: Pick<CategoryTagTable, 'id'>,
): DatabaseQuery<unknown> {
  const { error } = await supabase
    .from('Category_Tags')
    .delete()
    .eq('id', category.id);

  return error ? err(error) : ok({});
}
