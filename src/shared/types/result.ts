import type { PickOmit } from '@shared/types/property.ts';

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
export type PromiseResult<T, E> = Promise<Result<T, E>>;
export type DatabaseQueryResult<T, P extends keyof T> = Result<PickOmit<T, P>, Error>;
export type DatabaseQuery<T, P extends keyof T> = Promise<DatabaseQueryResult<T, P>>;
export type DatabaseQueryArrayResult<T, P extends keyof T> = Result<PickOmit<T, P>[], Error>;
export type DatabaseQueryArray<T, P extends keyof T> = Promise<DatabaseQueryArrayResult<T, P>>;
export type DatabaseViewResult<T> = Result<T, Error>;
export type DatabaseView<T> = PromiseResult<T, Error>;