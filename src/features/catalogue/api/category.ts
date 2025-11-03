import type {
  CategorizedProduct,
  Category,
  DatabaseView,
  RequiredColumns,
  Product,
} from '@shared/types';
import { supabase } from '@shared/api';
import { view } from '@shared/utils/database.ts';

export async function getTags(): DatabaseView<Category[]> {
  return view(
    await supabase
      .from('Category_Tags')
      .select('*')
      .order('name', { ascending: true }),
  );
}

export async function getTag(
  tag: RequiredColumns<Category, 'id'>,
): DatabaseView<Category> {
  return view(
    await supabase.from('Category_Tags').select('*').eq('id', tag.id).single(),
  );
}

export async function getProductsByAssignedTag(
  tag: RequiredColumns<Category, 'id'>,
): DatabaseView<CategorizedProduct[]> {
  return view(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('category_id', tag.id),
  );
}

export async function getAssignedTagsByProduct(
  product: RequiredColumns<Product, 'id'>,
): DatabaseView<CategorizedProduct[]> {
  return view(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('product_id', product.id),
  );
}
