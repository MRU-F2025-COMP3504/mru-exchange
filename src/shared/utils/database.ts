import { supabase } from '@shared/api';
import type {
  DatabaseQueryResult,
  ExtractArrayType,
  Result,
} from '@shared/types';
import { err, ok } from '@shared/utils';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * A utility function for validating database query responses.
 *
 * The {@link query()} evaluates the response of the database query with either of the two output types:
 * - The `data` payload property contains the successful query response.
 *   - If the response that is an object type exists, the query evaluates to success.
 * - The `error` payload property contains the failure query response.
 *   - If the response is empty, the query evaluates to an error.
 *   - If the response is unknown (i.e., `null` or `undefined`), the query evaluates to an error.
 *
 * @param response the given database query response
 * @returns the {@link DatabaseQueryResult} that may contain the database response
 * @see {@link DatabaseQueryResult} for more information on error handling
 */
export function query<
  Table extends object | null,
  Columns extends '*' | keyof ExtractArrayType<Table>,
>(
  response: PostgrestSingleResponse<Table>,
): DatabaseQueryResult<Table, Columns> {
  const { data, error } = response;
  let result: Result<Table>;

  if (data && typeof data === 'object') {
    result = ok(data);
  } else if (error) {
    result = err('Failed to query the database', error);
  } else {
    result = err('Unknown query result', response);
  }

  return result as DatabaseQueryResult<Table, Columns>;
}

export function getAssetByBucket(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
