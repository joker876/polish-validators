import { removeDashesSlashesAndWhitespace, toDigits } from './_utils';

const IMEI_REGEX = /^\d{15}$/;

/**
 * Validates an IMEI (International Mobile Equipment Identity) number, using the Luhn algorithm.
 * Checks that the IMEI is 15 digits. Any dashes, slashes, or whitespace are ignored.
 *
 * @param {string} imei - The 15-digit IMEI number as a string.
 * @returns {boolean} `true` if the IMEI is valid; `false` otherwise.
 */
export function isImeiValid(imei: string): boolean {
  imei = removeDashesSlashesAndWhitespace(imei);
  if (!IMEI_REGEX.test(imei)) {
    return false;
  }

  imei = toDigits(imei);

  let checkSum = 0;
  let digits = '';
  let v = 0;

  for (let i = 0; i < imei.length; i++) {
    v = parseInt(imei[i]);

    if (i % 2 !== 0) {
      v *= 2;
    }
    digits += v.toString();
  }

  for (let i = 0; i < digits.length; i++) {
    checkSum += parseInt(digits[i]);
  }
  return (checkSum %= 10) === 0;
}

/**
 * Validates an IMEI (International Mobile Equipment Identity) number, using the Luhn algorithm.
 * Checks that the IMEI is 15 digits. Any dashes, slashes, or whitespace are ignored.
 *
 * @param {string} imei - The 15-digit IMEI number as a string.
 * @returns {boolean} `true` if the IMEI is invalid; `false` otherwise.
 */
export const isImeiInvalid = (imei: string) => !isImeiValid(imei);
