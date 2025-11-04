import type { PromiseResult, Result } from '@shared/types';

export type RequiredColumns<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;
export type DatabaseQueryResult<T, P extends keyof T> = Result<
  RequiredColumns<T, P>,
  Error
>;
export type DatabaseQuery<T, P extends keyof T> = Promise<
  DatabaseQueryResult<T, P>
>;
export type DatabaseQueryArrayResult<T, P extends keyof T> = Result<
  RequiredColumns<T, P>[],
  Error
>;
export type DatabaseQueryArray<T, P extends keyof T> = Promise<
  DatabaseQueryArrayResult<T, P>
>;
export type DatabaseViewResult<T> = Result<T, Error>;
export type DatabaseView<T> = PromiseResult<T, Error>;
