// Regular Expression to Validate File Path and Extension
// (remodeled for unix path)
// submitter: anonymous
// https://regex101.com/r/ZaU81J/1

export const REGEX_IMAGE_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(png|jpg)$/i;
export const REGEX_TEXT_PATH = /^(\w|\.|\/[a-z_\-\s0-9.]+)+\.(txt)$/i;
