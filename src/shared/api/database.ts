import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { DatabaseQueryResult, DatabaseViewResult, Result } from '@shared/types';
import { err, ok } from '@shared/utils';

export function query<T, P extends keyof T>(response: PostgrestSingleResponse<T>): DatabaseQueryResult<T, P> {
  return process(response);
}

export function view<T>(response: PostgrestSingleResponse<T>): DatabaseViewResult<T> {
  return process(response);
}

function process<T>(
  response: PostgrestSingleResponse<T>,
): Result<T, Error> {
  const { data, error } = response;

  if (data) {
    return ok(data);
  } else if (error) {
    return err(error);
  }

  return err(new Error('Undetermined query result'));
}