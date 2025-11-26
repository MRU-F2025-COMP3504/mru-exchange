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

/**
 * A utility function that represents a "non-empty" {@link Result}.
 * Useful for evaluating the existence of the given payload disregarding the error message.
 *
 * The {@link present()} evaluates the given data with either the two output types:
 * - The `data` payload property contains the given data that is not `null` nor `undefined`.
 *    - If the given data is truthy, the payload property evaluates to the given payload.
 * - The `error` payload property contains the error message, indicating the given data as `null` or `undefined`.
 *    - If the given data is falsy, the payload property evaluates to the pre-defined error message.
 *
 * Compatible with all {@link Result} variants.
 *
 * @param data the given payload
 * @returns the wrapped result that may contain the given payload
 * @see {@link Result} and {@link PromiseResult} for more information
 * @see {@link present()} that performs the opposite evaluation
 */
export function present<T>(data: T | null | undefined): Result<T> {
  if (data) {
    return ok(data);
  }

  return err('Specified data is not present');
}
