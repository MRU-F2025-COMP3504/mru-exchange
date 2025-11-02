import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import { type DatabaseQuery, type ReviewTable } from '@shared/types';

export async function getProductReviews(
  id: number,
  columns: string,
): DatabaseQuery<ReviewTable[]> {
  const { data, error } = await supabase
    .from('Reviews')
    .select(columns as '*')
    .eq('product_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function getUserReviews(
  id: string,
  columns: string,
): DatabaseQuery<ReviewTable[]> {
  const { data, error } = await supabase
    .from('Reviews')
    .select(columns as '*')
    .eq('created_by_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function getReviewsForUser(
  id: string,
  columns: string,
): DatabaseQuery<ReviewTable[]> {
  const { data, error } = await supabase
    .from('Reviews')
    .select(columns as '*')
    .eq('created_on_id', id)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

// TODO
/*export async function createReview() {

}*/

export async function updateReview(
  id: number,
  review: Partial<Pick<ReviewTable, 'rating' | 'description'>>,
): DatabaseQuery<ReviewTable> {
  const { data, error } = await supabase
    .from('Reviews')
    .update(review)
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteReview(id: number): DatabaseQuery<unknown> {
  const { error } = await supabase.from('Reviews').delete().eq('id', id);

  return error ? err(error) : ok({});
}

export async function getProductAverageRating(
  id: number,
): DatabaseQuery<string> {
  const { data, error } = await supabase
    .from('Reviews')
    .select('rating.ave()')
    .eq('product_id', id)
    .single();

  return error ? err(error) : ok(data);
}

export async function getUserAverageRating(
  id: string,
): DatabaseQuery<string> {
  const { data, error } = await supabase
    .from('Reviews')
    .select('rating.ave()')
    .eq('created_on_id', id)
    .single();

  return error ? err(error) : ok(data);
}
