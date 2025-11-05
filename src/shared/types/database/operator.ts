import type { Result } from '@shared/types';

export type RequiredColumns<Table, Columns extends keyof Table> = Pick<
  Table,
  Columns
> &
  Partial<Omit<Table, Columns>>;
export type ExtractTable<TableArray> = TableArray extends (infer Table)[]
  ? Table
  : TableArray;

export type DatabaseQueryResult<
  Table,
  Columns extends '*' | keyof ExtractTable<Table>,
> = Result<
  Table extends never
    ? Table
    : Table extends (infer TableExtract)[]
      ? RequiredColumns<
          TableExtract,
          Columns extends '*'
            ? keyof TableExtract
            : Columns & keyof TableExtract
        >[]
      : RequiredColumns<
          Table,
          Columns extends '*' ? keyof Table : Columns & keyof Table
        >
>;
export type DatabaseQuery<
  Table,
  Columns extends '*' | keyof ExtractTable<Table>,
> = Promise<DatabaseQueryResult<Table, Columns>>;
