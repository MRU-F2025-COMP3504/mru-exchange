/**
 * Validates the given unique (UUID) image file path.
 * Use {@link RegExp.test()} to match the given image file path.
 *
 * @see {@link https://regex101.com/r/ZaU81J/1} (adjusted for uuids) (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_UNIQUE_IMAGE_PATH = /^[a-zA-Z0-9._-]+\.(png|jpg)$/i;

/**
 * Validates the given image file path.
 * Use {@link RegExp.test()} to match the given image file path.
 *
 * @see {@link https://regex101.com/r/ZaU81J/1} (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_IMAGE_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(png|jpg)$/i;

/**
 * Validates the given text file path.
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

/**
 * Validates the given username.
 * Use {@link RegExp.test()} to match the given username.
 *
 * @see {@link https://regex101.com/r/pG2xV4/1} (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_LETTER_NUMBERS_ONLY = /^[a-zA-Z0-9]+$/;

/**
 * Validates the given letters.
 * Use {@link RegExp.test()} to match the given letters.
 *
 * @see {@link https://regex101.com/r/uH9aA7/1} (Submitter: Anonymous)
 * @returns the {@link RegExp} object
 */
export const REGEX_LETTERS_ONLY = /^(?=.*?[A-Za-z])[A-Za-z+]+$/;
