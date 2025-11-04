import type { Result } from '@shared/types';

export type RequiredColumns<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
export type DatabaseQueryResult<T, P> =
  T extends (infer R)[]
    ? P extends keyof R
      ? Result<RequiredColumns<R, P>[], Error>
      : Result<R[], Error>
    : P extends keyof T
      ? Result<RequiredColumns<T, P>, Error>
      : Result<T, Error>;
export type DatabaseQuery<T, P> = Promise<DatabaseQueryResult<T, P>>;