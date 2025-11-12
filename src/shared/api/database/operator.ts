import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { DatabaseQueryResult, ExtractTable, Result } from '@shared/types';
import { err, ok } from '@shared/utils';

export function query<
  Table extends object | null,
  Columns extends '*' | keyof ExtractTable<Table>,
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
