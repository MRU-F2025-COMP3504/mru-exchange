import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import type {
  CategoryTagTable,
  DatabaseQueryResult,
  PickOmit,
} from '@shared/types';

export async function getAllCategories(
  select: string,
): DatabaseQueryResult<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .select(select)
    .order('name', { ascending: true });

  return error ? err(error) : ok(data);
}

export async function getCategory(
  id: number,
  select: string,
): DatabaseQueryResult<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .select(select)
    .eq('id', id)
    .single();

  return error ? err(error) : ok(data);
}

export async function getCategoryProducts(
  id: number,
  select: string,
): DatabaseQueryResult<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Assigned_Products')
    .select(select)
    .eq('category_id', id);

  return error ? err(error) : ok(data);
}

export async function getCategoryProductCount(
  id: number,
  select: string,
): DatabaseQueryResult<CategoryTagTable> {
  const { count, error } = await supabase
    .from('Category_Assigned_Products')
    .select(select, { count: 'exact', head: true })
    .eq('category_id', id);

  return error ? err(error) : ok(count);
}

export async function createCategory(
  category: PickOmit<CategoryTagTable, 'name'>,
): DatabaseQueryResult<CategoryTagTable> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .insert(category)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function updateCategory(
  category: PickOmit<CategoryTagTable, 'id'>,
): DatabaseQueryResult<CategoryTagTable> {
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
): DatabaseQueryResult<{}> {
  const { error } = await supabase
    .from('Category_Tags')
    .delete()
    .eq('id', category.id);

  return error ? err(error) : ok({});
}
