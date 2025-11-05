import type {
  CategorizedProduct,
  Category,
  RequiredColumns,
  Product,
  DatabaseQuery,
} from '@shared/types';
import { query, supabase } from '@shared/api';

export async function getTags(): DatabaseQuery<Category[], '*'> {
  return query(
    await supabase
      .from('Category_Tags')
      .select('*')
      .order('name', { ascending: true }),
  );
}

export async function getTag(
  tag: RequiredColumns<Category, 'id'>,
): DatabaseQuery<Category, '*'> {
  return query(
    await supabase.from('Category_Tags').select('*').eq('id', tag.id).single(),
  );
}

export async function getProductsByAssignedTag(
  tag: RequiredColumns<Category, 'id'>,
): DatabaseQuery<CategorizedProduct[], '*'> {
  return query(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('category_id', tag.id),
  );
}

export async function getAssignedTagsByProduct(
  product: RequiredColumns<Product, 'id'>,
): DatabaseQuery<CategorizedProduct[], '*'> {
  return query(
    await supabase
      .from('Category_Assigned_Products')
      .select('*')
      .eq('product_id', product.id),
  );
}
