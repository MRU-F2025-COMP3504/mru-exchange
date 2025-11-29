import type { NullableResult, Result } from '@shared/types';

/**
 * A utility function that wraps the successful computation output into a {@link Result}.
 * - The `ok` property evaluates to `true`.
 * Compatible with all {@link Result} variants.
 *
 * @param data the payload to wrap
 * @returns the wrapped {@link Result} that represents a successful computation
 * @see {@link Result}
 * @see {@link PromiseResult}
 */
export function ok<T>(data: T): Result<T> {
  return { ok: true, data, error: null };
}

/**
 * A utility function that wraps the failed computation output into a {@link Result}.
 * - The `ok` property evaluates to `false`.
 * Compatible with all {@link Result} variants.
 *
 * @param message the given error message
 * @param cause the given "parent" error that represents the cause(s) of the failed computation
 * @returns the wrapped {@link Result} that represents a failed computation or error
 * @see {@link Result}
 * @see {@link PromiseResult}
 */
export function err<T>(message?: string, cause?: unknown): Result<T> {
  const result: Result<T> = {
    ok: false,
    data: null,
    error: new Error(message, { cause }),
  };

  // By default, outputs the error result to stderr
  console.error('ERROR:', (message ?? '') + '\n', result);

  return result;
}

/**
 * A utility function that represents a {@link NullableResult}.
 * Both the `data` and `error` payload are `null`.
 * - The `ok` property evaluates to `false`.
 *
 * Compatible with all {@link Result} variants.
 *
 * @returns the wrapped {@link Result} that represents an empty payload
 * @see {@link present()} that performs the opposite evaluation
 * @see {@link Result}
 * @see {@link NullableResult}
 * @see {@link PromiseResult}
 * @see {@link PromiseNullableResult}
 */
export function empty<T>(): NullableResult<T> {
  return { ok: false, data: null, error: null };
}
