import type { Result, UnwrappedResult } from '@shared/types';

/**
 * A utility function that unwraps the given {@link Result}, which contains both the `data` and `error` property.
 * When either of the property exists, the other property would be `undefined`.
 *
 * Incompatible with {@link Result} variants.
 *
 * @param result the given result to unwrap
 * @returns an unwrapped result
 * @see {@link Result}
 * @see {@link UnwrappedResult}
 */
export function unwrap<T, E extends Error>(
  result: Result<T, E>,
): UnwrappedResult<T, E> {
  if (result.ok) {
    return { data: result.data, error: undefined };
  } else {
    return { data: undefined, error: result.error };
  }
}

/**
 * A utility function that wraps the payload into a {@link Result}.
 * This function evaluates the `ok` conditional property to `true`.
 *
 * Compatible with all {@link Result} variants.
 *
 * @see {@link Result} and {@link PromiseResult} for more information
 *
 * @param data the payload to handle
 * @returns the wrapped result that represents a successful computation
 */
export function ok<T, E extends Error>(data: T): Result<T, E> {
  return { ok: true, data };
}

/**
 * A utility function that wraps the payload into a {@link Result}.
 * This function evaluates the `ok` conditional property to `false`.
 * Any {@link Error} variant is compatible with the payload of type `E`,
 * which is constrained to type {@link Error}.
 *
 * Compatible with all {@link Result} variants.
 *
 * @see {@link Result}
 * @see {@link PromiseResult}
 *
 * @param error the payload to handle, which may be an {@link Error} or `string`
 * @returns the wrapped result that represents a failed computation or error
 */
export function err<T, E extends Error>(error: E | string): Result<T, E> {
  if (typeof error === 'string') {
    return { ok: false, error: new Error(error) as E };
  }

  return { ok: false, error };
}

/**
 * A utility function that represents an "empty" {@link Result}.
 * This function evaluates the `ok` conditional property to `false`.
 * The `error` payload property is empty.
 * Useful for representing `null` payload properties.
 *
 * Compatible with all {@link Result} variants.
 *
 * @see {@link Result} and {@link PromiseResult} for more information
 * @see {@link present()} that performs the opposite evaluation
 *
 * @returns the wrapped result that represents an empty payload
 */
export function empty<T, E extends Error>(): Result<T, E> {
  return { ok: false, error: new Error() as E };
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
 * @see {@link Result} and {@link PromiseResult} for more information
 * @see {@link present()} that performs the opposite evaluation
 *
 * @param data the given payload
 * @returns the wrapped result that may contain the given payload
 */
export function present<T>(data: T | null | undefined): Result<T> {
  if (data) {
    return ok(data);
  }

  return err('Specified data is not present');
}
