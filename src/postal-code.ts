const POSTAL_CODE_REGEX = /^\d{2}-?\d{3}$/;

/**
 * Validates a Polish postal code format. This function checks that the code follows
 * the format `XX-XXX`, where each `X` is a digit. The dash in the format is optional,
 * but putting a dash in the wrong place will result in the code being invalid.
 * This function does not validate whether a code actually exists.
 *
 * @param {string} code - The postal code as a string.
 * @returns {boolean} `true` if the postal code format is valid; `false` otherwise.
 */
export function isPostalCodeValid(code: string): boolean {
  return POSTAL_CODE_REGEX.test(code);
}

/**
 * Validates a Polish postal code format. This function checks that the code follows
 * the format `XX-XXX`, where each `X` is a digit. The dash in the format is optional,
 * but putting a dash in the wrong place will result in the code being invalid.
 * This function does not validate whether a code actually exists.
 *
 * @param {string} code - The postal code as a string.
 * @returns {boolean} `true` if the postal code format is invalid; `false` otherwise.
 */
export const isPostalCodeInvalid = (code: string) => !isPostalCodeValid(code);
