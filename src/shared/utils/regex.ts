/**
 * Validates the given image file path.
 * Use {@link RegExp.test()} to match the given image file path.
 *
 * @see {@link https://regex101.com/r/ZaU81J/1} (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_IMAGE_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(png|jpg)$/i;

/**
 * Validates the given text file path with the following regular expression.
 * Use {@link RegExp.test()} to match the given text file path.
 *
 * @see {@link https://regex101.com/r/ZaU81J/1} (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_TEXT_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(txt)$/i;

/**
 * Validates the given email address.
 * Use {@link RegExp.test()} to match the given email address.
 *
 * @see {@link https://regex101.com/r/mX1xW0/1} (Submitter: jago)
 * @returns the {@link RegExp} object
 */
export const REGEX_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@(mtroyal\.ca)$/i;
