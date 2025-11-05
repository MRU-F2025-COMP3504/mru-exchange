import type { Result } from '@shared/types';

export type RequiredColumns<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
export type DatabaseQueryResult<T, P> =
  T extends (infer R)[]
    ? P extends keyof R
      ? Result<RequiredColumns<R, P>[]>
      : Result<R[]>
    : P extends keyof T
      ? Result<RequiredColumns<T, P>>
      : Result<T>;
export type DatabaseQuery<T, P> = Promise<DatabaseQueryResult<T, P>>;
export type DatabaseQueryResponse<T, P extends keyof T> = Result<T> | Result<RequiredColumns<T, P>>;