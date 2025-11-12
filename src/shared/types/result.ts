export type Result<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };
export type PromiseResult<T, E extends Error = Error> = Promise<Result<T, E>>;
