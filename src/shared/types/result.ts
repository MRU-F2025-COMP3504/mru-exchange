import type { ExtractArrayType, RequireProperty } from '@shared/types';

/**
 * A utility type for handling the **non-null** output of a computation.
 * Inspired by Rust's Result ({@link https://doc.rust-lang.org/std/result/}) type.
 *
 * Used primarily for data validation of inputs/outputs, such as a database query.
 * The {@link Result} type provides a convienient alternative for error handling,
 * which aims to easily propagate errors and eliminates the verbose syntax usage of the try-catch statement.
 * The type of output depends on the computation of the function that returned this {@link Result}.
 *
 * {@link Result} has two output types:
 * - The successful computed result that contains the `data` (of type `T`) payload.
 * - The failed computed result that contains the `error` (of type `E` constrained to type {@link Error}) payload.
 *
 * An output that contains both the `data` and `error` non-null payloads **cannot** exist.
  
 * ```
 * const result = compute(input);
 * const { data, error } = result; // destructure result
 *
 * if (data) {
 *  console.log(data);
 * } else {
 *  console.error(error);
 * }
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on the union operator
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 * @see {@link NullableResult} for a nullable version of a result
 */
export type Result<T, E extends Error = Error> =
  | { data: T; error: null }
  | { data: null; error: E };

/**
 * A utility type for handling a **nullable** output of a computation.
 *
 * Used primarily for data validation of inputs/outputs, such as a database query.
 * The {@link Result} type provides a convienient alternative for error handling,
 * which aims to easily propagate errors and eliminates the verbose syntax usage of the try-catch statement.
 * The type of output depends on the computation of the function that returned this {@link Result}.
 *
 * Unlike {@link Result}, a {@link NullableResult} has three output types:
 * - The successful computed result that contains the `data` (of type `T`) payload.
 * - The failed computed result that contains the `error` (of type `E` constrained to type {@link Error}) payload.
 * - The computation, which may or may not be successful, produced a `null` output.
 *
 * An output that contains both the `data` and `error` non-null payloads **cannot** exist.
 * However, an output that does not have the `data` and `error` payloads (in this case, both properties are `null`) can exist.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on the union operator
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 * @see {@link Result} for a non-null version of a result
 */
export type NullableResult<T, E extends Error = Error> =
  | Result<T, E>
  | {
    data: null;
    error: null;
  };

/**
 * A utility type for handling the **non-null** output of an asynchronous (`async`) computation.
 * The {@link PromiseResult} is a type alias that only wraps the {@link Result} type with the {@link Promise} type.
 *
 * The resolved {@link Promise} (i.e., {@link Result}) that contains both the `data` and `error` non-null payloads **cannot** exist.
 *
 * ```
 * const promise = compute(input);
 * const result = await promise;
 * const { data, result } = result; // destructure result
 *
 * if (data) {
 *  console.log(data);
 * } else {
 *  console.error(error);
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} for more information on {@link Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await} for more information on awaiting a {@link Promise}
 * @see {@link PromiseNullableResult} for a nullable version of a result
 * @see {@link Result}
 */
export type PromiseResult<T, E extends Error = Error> = Promise<Result<T, E>>;

/**
 * A utility type for handling the **null** output of an asynchronous (`async`) computation.
 * The {@link PromiseResult} is a type alias that only wraps the {@link NullableResult} type with the {@link Promise} type.
 *
 * The resolved {@link Promise} (i.e., {@link Result}) that contains both the `data` and `error` non-null payloads **cannot** exist.
 * However, the {@link Result} that does not have the `data` and `error` payloads (in this case, both properties are `null`) can exist.
 *
 * ```
 * const promise = compute(input);
 * const result = await promise;
 * const { data, result } = result; // destructure result
 *
 * if (data) {
 *  console.log(data);
 * } else {
 *  console.error(error);
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} for more information on {@link Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await} for more information on awaiting a {@link Promise}
 * @see {@link PromiseResult} for a non-nullable version of a result
 * @see {@link NullableResult}
 */
export type PromiseNullableResult<T, E extends Error = Error> = Promise<
  NullableResult<T, E>
>;

/**
 * A utility type for handling the **non-null** output of a database query.
 * Uses {@link Result} for error handling.
 *
 * The {@link DatabaseQueryResult} evaluates the output type of a database query based on the given `Table` type and `Columns` property type(s).
 * Similar to {@link RequireProperty}, but uses conditional types to distinguish between given column(s) types and all column types (`*`).
 * - The asterisk (`*`) selects all columns.
 * - One or more `Columns` may be specified with the union (e.g., `'id' | 'name' | 'email'`).
 *   and intersection (e.g., `keyof UserChat & keyof InteractingUsers`) operators.
 * - An array may be specified to obtain multiple rows.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on union and intersection operators
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 * @see {@link DatabaseQuery} for a query version that has yet to be awaited
 * @see {@link Result}
 */
export type DatabaseQueryResult<
  Table,
  Columns extends '*' | keyof ExtractArrayType<Table>,
> = Result<
  Table extends never
  ? Table
  : Table extends (infer TableExtract)[]
  ? RequireProperty<
    TableExtract,
    Columns extends '*'
    ? keyof TableExtract
    : Columns & keyof TableExtract
  >[]
  : RequireProperty<
    Table,
    Columns extends '*' ? keyof Table : Columns & keyof Table
  >
>;

/**
 * A utility type for handling the **non-null** output of a database query that is wrapped in a {@link Promise}.
 * Uses {@link PromiseResult} to unwrap the {@link Promise} and {@link Result}.
 *
 * The {@link DatabaseQuery} is a type alias that only wraps the {@link DatabaseQueryResult} type with the {@link Promise} type.
 * The usage of {@link DatabaseQuery} is equivalent to the {@link DatabaseQueryResult}, but requires the extra step of awaiting the {@link Promise}.
 *
 * The {@link DatabaseQuery} that is awaited (i.e., {@link DatabaseQueryResult}) evaluates the output type of a database query based on the given `Table` type and `Columns` property type(s).
 * Similar to {@link RequireProperty}, but uses conditional types to distinguish between given column(s) types and all column types (`*`).
 * - The asterisk (`*`) selects all columns.
 * - One or more `Columns` may be specified with the union (e.g., `'id' | 'name' | 'email'`).
 *   and intersection (e.g., `keyof UserChat & keyof InteractingUsers`) operators.
 * - An array may be specified to obtain multiple rows.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} for more information on {@link Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await} for more information on awaiting a {@link Promise}
 * @see {@link DatabaseQueryResult} for a query version that has been awaited
 * @see {@link PromiseResult}
 */
export type DatabaseQuery<
  Table,
  Columns extends '*' | keyof ExtractArrayType<Table>,
> = Promise<DatabaseQueryResult<Table, Columns>>;
