import type {
  ExtractArrayType,
  DatabaseQueryResult,
  Result,
} from '@shared/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ok, err } from './result';

/**
 * A utility function for validating database query responses.
 *
 * The {@link query()} evaluates the response of the database query with either of the two output types:
 * - The `data` payload property contains the successful query response.
 *   - If the response is truthy and an object type, the payload property evaluates to the sucessful query response.
 * - The `error` payload property contains the failure query response.
 *   - If the response is empty, the payload property evaluates to an error.
 *   - If the response is unknown (i.e., `null` or `undefined`), the payload property evaluates to an error.
 *
 * @see {@link DatabaseQueryResult} for more information on error handling
 *
 * @param response the given database query response
 * @returns a wrapped query result that may contain the database response
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
    result = err(error);
  } else {
    result = err(new Error('Unknown query result', { cause: response }));
  }

  return result as DatabaseQueryResult<Table, Columns>;
}
