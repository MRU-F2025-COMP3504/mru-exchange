import type { NullableResult, Result } from '@shared/types';

/**
 * A utility function that wraps the payload into a {@link Result}.
 * Compatible with all {@link Result} variants.
 *
 * @param data the payload to handle
 * @returns the wrapped result that represents a successful computation
 * @see {@link Result}
 * @see {@link PromiseResult}
 */
export function ok<T, E extends Error>(data: T): Result<T, E> {
  return { data, error: null };
}

/**
 * A utility function that wraps the payload into a {@link Result}.
 * Compatible with all {@link Result} variants.
 *
 * @param error the payload to handle, which may be an {@link Error} or `string`
 * @returns the wrapped result that represents a failed computation or error
 * @see {@link Result}
 * @see {@link PromiseResult}
 */
export function err<T, E extends Error>(error: E | string): Result<T, E> {
  return { data: null, error: (typeof error === 'string' ? new Error(error) : error) as E };
}

/**
 * A utility function that represents a {@link NullableResult}.
 * Both the `data` and `error` payload are `null`.
 *
 * Compatible with all {@link Result} variants.
 *
 * @returns the wrapped result that represents an empty payload
 * @see {@link present()} that performs the opposite evaluation
 * @see {@link Result}
 * @see {@link NullableResult}
 * @see {@link PromiseResult}
 * @see {@link PromiseNullableResult}
 */
export function empty<T, E extends Error>(): NullableResult<T, E> {
  return { data: null, error: null };
}
