import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  RequiredColumns,
  Product,
} from '@shared/types';
import { query, supabase } from '@shared/api';

export async function register(
  category: RequiredColumns<Category, 'name' | 'description'>,
): DatabaseQuery<Category, '*'> {
  return query(
    await supabase.from('Category_Tags').insert(category).select('*').single(),
  );
}

export async function remove(
  ...categories: RequiredColumns<Category, 'id'>[]
): DatabaseQuery<Category[], 'id'> {
  return query(
    await supabase
      .from('Category_Tags')
      .delete()
      .in('id', categories.map((category) => category.id))
      .select('id')
  );
}

export async function set(
  target: RequiredColumns<Category, 'id'>,
  change: Pick<Partial<Category>, 'name' | 'description'>,
): DatabaseQuery<Category, '*'> {
  return query(
    await supabase
      .from('Category_Tags')
      .update(change)
      .eq('id', target.id)
      .select('*')
      .single(),
  );
}

export async function tag(
  product: RequiredColumns<Product, 'id'>,
  ...categories: RequiredColumns<Category, 'id'>[]
): DatabaseQuery<CategorizedProduct[], '*'> {
  return query(
    await supabase
      .from('Category_Assigned_Products')
      .insert(
        categories.map((category) => ({
          category_id: category.id,
          product_id: product.id,
        })),
      )
      .select('*'),
  );
}
