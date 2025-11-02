import type { DatabaseQueryResult, Result } from '@shared/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export function ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data };
}

export function err<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}

export function query<T>(
  response: PostgrestSingleResponse<T>,
): DatabaseQueryResult<T> {
  const { data, error } = response;

  if (data) {
    return ok(data);
  } else if (error) {
    return err(error);
  }

  return err(new Error('Undetermined query result'));
}
