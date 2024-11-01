import { removeDashesAndWhitespace } from './_utils';

const REGON_REGEX = /^(\d{9}|\d{14})$/;
const REGON_REGEX_ALL_ZEROES = /^0+$/;
const REGON_WEIGHTS_9 = [8, 9, 2, 3, 4, 5, 6, 7];
const REGON_WEIGHTS_14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];

/**
 * Validates a REGON (Polish National Business Registry Number) string.
 * The function checks for 9- or 14-digit formats and calculates a checksum according to
 * REGON requirements. Any dashes or whitespace are ignored.
 *
 * @param {string} regon - The REGON number as a string, which may include dashes or whitespace.
 * @returns {boolean} `true` if the REGON is valid; `false` otherwise.
 */
export function isRegonValid(regon: string): boolean {
  regon = removeDashesAndWhitespace(regon);
  if (!REGON_REGEX.test(regon) || REGON_REGEX_ALL_ZEROES.test(regon)) {
    return false;
  }

  const sum = REGON_WEIGHTS_9.reduce((acc, weight, index) => {
    return acc + parseInt(regon.charAt(index)) * weight;
  }, 0);
  const controlNumber = parseInt(regon.charAt(REGON_WEIGHTS_9.length));

  if ((sum % 11) % 10 !== controlNumber) {
    return false;
  }
  if (regon.length === 9) return true;

  const sum14 = REGON_WEIGHTS_14.reduce((acc, weight, index) => {
    return acc + parseInt(regon.charAt(index)) * weight;
  }, 0);
  const controlNumber14 = parseInt(regon.charAt(REGON_WEIGHTS_14.length));

  return (sum14 % 11) % 10 === controlNumber14;
}

/**
 * Validates a REGON (Polish National Business Registry Number) string.
 * The function checks for 9- or 14-digit formats and calculates a checksum according to
 * REGON requirements. Any dashes or whitespace are ignored.
 *
 * @param {string} regon - The REGON number as a string, which may include dashes or whitespace.
 * @returns {boolean} `true` if the REGON is invalid; `false` otherwise.
 */
export const isRegonInvalid = (regon: string) => !isRegonValid(regon);
