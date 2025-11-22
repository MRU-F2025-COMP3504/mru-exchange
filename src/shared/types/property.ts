/**
 * A utility type that makes all properties optional except the given key of `GivenObject` (i.e., `Properties`).
 * Helpful for isolating one or more object properties that is only needed from the entire object (e.g., selecting columns from a database query).
 *
 * `Properties` may be specified with one or more properties using union and intersection operators.
 * - e.g., `RequireProperty<UserProfile, 'id' | 'name' | 'email'>`
 * - e.g., `RequireProperty<UserChat, keyof UserChat & keyof InteractingUsers>`
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types} for more information on union and intersection operators
 * @see {@link https://www.typescriptlang.org/docs/handbook/utility-types.html} for more information on utility types used for {@link RequireProperty}
 */

export type RequireProperty<
  GivenObject,
  Properties extends keyof GivenObject,
> = Pick<GivenObject, Properties> & Partial<Omit<GivenObject, Properties>>;

/**
 * A utility type that extracts the non-array inner type of an array.
 * Helpful for distinguishing between a non-array and an array type, both of which are of type `T`.
 * - e.g., `ExtractArrayType<string[]>` evaluates to `string`
 * - e.g., `ExtractArrayType<UserProfile[]>` evaluates to `UserProfile`
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/conditional-types.html} for more information on conditional types
 */
export type ExtractArrayType<GivenObject> =
  GivenObject extends (infer InnerType)[] ? InnerType : GivenObject;
