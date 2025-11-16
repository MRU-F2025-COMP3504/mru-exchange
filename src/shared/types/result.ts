import type { ExtractArrayType, RequireProperty } from '@shared/types';

/**
 * A utility type for handling the output of a function.
 * Inspired by Rust's Result ({@link https://doc.rust-lang.org/std/result/}) type.
 *
 * Used primarily for data validation of inputs/outputs, such as a database query.
 * The {@link Result} type provides a convienient alternative for error handling,
 * which aims to easily propagate errors and eliminates the verbose syntax usage of the try-catch statement.
 * The type of output depends on the computation of the function that returned this {@link Result}.
 *
 * {@link Result} has two output types:
 * - The successful computed result that contains the expected success output.
 *   The result would contain an `ok` conditional property that evaluates to `true` and the `data` (of type `T`) payload property.
 * - The failed computed result that contains an {@link Error}.
 *   The result would contain an `ok` conditional property that evaluates to `false` and the `error` (of type `E` constrained to type `Error`) payload property.
 *
 * The `ok` conditional property holds these two types of outputs together to unwrap the result (as denoted by the union operator).
 * An output that contains both the `data` and `error` payload properties **cannot** exist.
 *
 * **It is important to know that types (i.e., type checking) in TypeScript are evaluated in compile-time.**
 * When TypeScript gets compiled down to JavaScript, the latter does not know TypeScript types (i.e., {@link Result}) **other than** JavaScript's primitive data types.
 *
 * To resolve the successful computation,
 * the {@link Result} must be unwrapped by handling the `ok` property using a conditional (branch) statement
 * to extract the payload property (i.e., `data` or `error`).
 *
 * ```
 * const result = compute(input);
 *
 * if (result.ok) {
 *  const data = result.data;
 *
 *  console.log(data);
 * } else {
 *  const error = result.error;
 *
 *  console.error(error);
 * }
 *
 * // an alternative unwrap
 *
 * const result = compute(input);
 *
 * if (!result.ok) {
 *  const error = result.error;
 *
 *  console.error(error);
 * } else {
 *  const data = result.data;
 *
 *  console.log(data);
 * }
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on the union operator
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 */
export type Result<T, E extends Error = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * A utility type for handling the output of an asynchronous (`async`) function.
 * The {@link PromiseResult} is a type alias that only wraps the {@link Result} type with the {@link Promise} type.
 *
 * To resolve the successful computation, the {@link PromiseResult} must be unwrapped by first awaiting upon the {@link Promise}.
 * The caller waits for the {@link Promise} to resolve (e.g., waiting to receive data from the backend over an HTTP connection).
 * When the {@link Promise} is resolved, the `ok` conditional property must be handled using a conditional (branch) statement to extract the payload property (i.e., `data` or `error`).
 *
 * ```
 * const promise = compute(input);
 * const result = await promise;
 *
 * if (result.ok) {
 *  console.log(result.data);
 * } else {
 *  console.error(result.error);
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} for more information on {@link Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await} for more information on awaiting a {@link Promise}
 * @see {@link Result} for more information
 */
export type PromiseResult<T, E extends Error = Error> = Promise<Result<T, E>>;

/**
 * A utility type for handling the output of a database query.
 * Uses {@link Result} for error handling.
 *
 * The {@link DatabaseQueryResult} evaluates the output type of a database query based on the given `Table` type and `Columns` property type(s).
 * Similar to {@link RequireProperty}, but uses conditional types to distinguish between given column(s) types and all column types (`*`).
 * - The asterisk (`*`) selects all columns.
 * - One or more `Columns` may be specified with the union (e.g., `'id' | 'name' | 'email'`)
 *   and intersection (e.g., `keyof UserChat & keyof InteractingUsers`) operators.
 *
 * Likewise with {@link Result}, the {@link DatabaseQueryResult} must be unwrapped by handling the `ok` conditional property using a conditional (branch) statement.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on union and intersection operators
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 * @see {@link DatabaseQuery} for a {@link PromiseResult} version
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
 * A utility type for handling the output of a database query that is wrapped in a {@link Promise}.
 * Uses {@link PromiseResult} to unwrap the {@link Promise} and {@link Result}.
 *
 * The {@link DatabaseQuery} is a type alias that only wraps the {@link DatabaseQueryResult} type with the {@link Promise} type.
 * The usage of {@link DatabaseQuery} is equivalent to the {@link DatabaseQueryResult}, but needs the extra step of awaiting the {@link Promise}.
 *
 * To resolve the successful computation, the {@link DatabaseQuery} must be unwrapped by first awaiting upon the {@link Promise}.
 * The caller waits for the {@link Promise} to resolve (i.e., waiting to receive data from the database).
 * When the {@link Promise} is resolved, the `ok` conditional property must be handled using a conditional (branch) statement to extract the payload property (i.e., `data` or `error`).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} for more information on {@link Promise}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await} for more information on awaiting a {@link Promise}
 * @see {@link DatabaseQueryResult} for a non-promise result version
 * @see {@link PromiseResult}
 */
export type DatabaseQuery<
  Table,
  Columns extends '*' | keyof ExtractArrayType<Table>,
> = Promise<DatabaseQueryResult<Table, Columns>>;
