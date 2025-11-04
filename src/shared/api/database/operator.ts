import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type {
  RequiredColumns,
  Result,
} from '@shared/types';
import { err, ok } from '@shared/utils';

export function query<T, P extends keyof T>(
  response: PostgrestSingleResponse<T>
): Result<T, Error> | Result<RequiredColumns<T, P>, Error> {
  const { data, error } = response;

  if (data) {
    return ok(data);
  } else if (error) {
    return err(error);
  }

  return err(new Error('Undetermined query result'));
}