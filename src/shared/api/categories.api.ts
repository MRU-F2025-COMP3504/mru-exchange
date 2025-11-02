import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  PickOmit,
} from '@shared/types';

export async function getAllCategories(
  columns: string,
): DatabaseQuery<Category[]> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .select(columns as '*')
    .order('name', { ascending: true });

  return error ? err(error) : ok(data);
}

export async function getCategory(
  id: number,
  columns: string,
): DatabaseQuery<Category> {
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
): DatabaseQuery<CategorizedProduct[]> {
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
  category: PickOmit<Category, 'name'>,
): DatabaseQuery<Category> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .insert(category)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function updateCategory(
  category: PickOmit<Category, 'id'>,
): DatabaseQuery<Category> {
  const { data, error } = await supabase
    .from('Category_Tags')
    .update(category)
    .eq('id', category.id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteCategory(
  category: Pick<Category, 'id'>,
): DatabaseQuery<unknown> {
  const { error } = await supabase
    .from('Category_Tags')
    .delete()
    .eq('id', category.id);

  return error ? err(error) : ok({});
}
