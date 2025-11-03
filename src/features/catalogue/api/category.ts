import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  DatabaseView,
  PickOmit,
  Product,
} from '@shared/types';
import { supabase } from '@shared/api';
import { query, view } from '@shared/api/database.ts';

export async function getTags(): DatabaseView<Category[]> {
  return view(
    await supabase
      .from('Category_Tags')
      .select('*')
      .order('name', { ascending: true }),
  );
}

export async function getTag(
  tag: PickOmit<Category, 'id'>,
): DatabaseView<Category> {
  return view(
    await supabase.from('Category_Tags').select('*').eq('id', tag.id).single(),
  );
}

export async function getProductsByAssignedTag(
  tag: PickOmit<Category, 'id'>,
): DatabaseView<CategorizedProduct[]> {
  return view(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('category_id', tag.id),
  );
}

export async function getAssignedTagsByProduct(
  product: PickOmit<Product, 'id'>,
): DatabaseView<CategorizedProduct[]> {
  return view(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('product_id', product.id),
  );
}

export async function create();
