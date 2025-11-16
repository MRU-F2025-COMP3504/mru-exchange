// Title: Regular Expression to Validate File Path and Extension (remodeled for unix path)
// Submitter: anonymous
// Link: https://regex101.com/r/ZaU81J/1
// Valid states:
//  - `c:/path/to/file`
//  - `/path/to/file`
//  - `path/to/file`
//  - `./path/to/file`
//  - `../path/to/file`
//  - `.././path/to/file`
//  - `../../path/to/file`

/**
 * Matches the image file path with the following regular expression.
 */
export const REGEX_IMAGE_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(png|jpg)$/i;

/**
 * Matches the text file path with the following regular expression.
 */
export const REGEX_TEXT_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(txt)$/i;
