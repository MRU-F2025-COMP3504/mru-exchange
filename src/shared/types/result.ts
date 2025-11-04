export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
export type PromiseResult<T, E> = Promise<Result<T, E>>;