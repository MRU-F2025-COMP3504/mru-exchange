import { supabase } from '@shared/api';
import { ok, err } from '@shared/utils';
import { type DatabaseQueryResult, type ReviewTable } from '@shared/types';

export async function getProductReviews(
  id: number,
  columns: string,
): DatabaseQueryResult<ReviewTable[]> {
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
): DatabaseQueryResult<ReviewTable[]> {
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
): DatabaseQueryResult<ReviewTable[]> {
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
): DatabaseQueryResult<ReviewTable> {
  const { data, error } = await supabase
    .from('Reviews')
    .update(review)
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteReview(id: number): DatabaseQueryResult<unknown> {
  const { error } = await supabase.from('Reviews').delete().eq('id', id);

  return error ? err(error) : ok({});
}

export async function getProductAverageRating(
  id: number,
): DatabaseQueryResult<string> {
  const { data, error } = await supabase
    .from('Reviews')
    .select('rating.ave()')
    .eq('product_id', id)
    .single();

  return error ? err(error) : ok(data);
}

export async function getUserAverageRating(
  id: string,
): DatabaseQueryResult<string> {
  const { data, error } = await supabase
    .from('Reviews')
    .select('rating.ave()')
    .eq('created_on_id', id)
    .single();

  return error ? err(error) : ok(data);
}
