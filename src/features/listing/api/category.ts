import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  DatabaseView,
  PickOmit,
  Product,
} from '@shared/types';
import { query } from '@shared/api/database.ts';
import { supabase } from '@shared/api';

export async function register(
  category: PickOmit<Category, 'name' | 'description'>,
): DatabaseView<Category> {
  return query(
    await supabase.from('Category_Tags').insert(category).select().single(),
  );
}

export async function remove(
  category: PickOmit<Category, 'id'>,
): DatabaseQuery<Category, 'id'> {
  return query(
    await supabase
      .from('Category_Tags')
      .delete()
      .eq('id', category.id)
      .select('id')
      .single(),
  );
}

export async function set(
  old: PickOmit<Category, 'id'>,
  change: Pick<Partial<Category>, 'name' | 'description'>,
): DatabaseView<Category> {
  return query(
    await supabase
      .from('Category_Tags')
      .update(change)
      .eq('id', old.id)
      .select('*')
      .single(),
  );
}

export async function tag(
  product: PickOmit<Product, 'id'>,
  ...categories: PickOmit<Category, 'id'>[]
): DatabaseView<CategorizedProduct[]> {
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
