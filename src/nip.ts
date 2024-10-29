import { removeDashesAndWhitespace, toDigits } from './_utils';

const NIP_REGEX = /^\d{10,13}$/;
const NIP_REGEX_ALL_ZEROES = /^0+$/;
const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7];

/**
 * Validates a NIP (Polish tax identification number) string.
 * This function checks the format of the NIP, ensuring it has either 10 or 13 digits,
 * is not all zeros, and meets a specific checksum requirement. Any dashes or whitespace
 * are ignored.
 *
 * @param {string} nip - The NIP number as a string, which may include dashes or whitespace.
 * @returns {boolean} `true` if the NIP is valid; `false` otherwise.
 */
export function isNipValid(nip: string): boolean {
  nip = removeDashesAndWhitespace(nip);
  if (!NIP_REGEX.test(nip) || NIP_REGEX_ALL_ZEROES.test(nip)) {
    return false;
  }

  nip = toDigits(nip);

  const sum = NIP_WEIGHTS.reduce((acc, weight, index) => {
    return acc + parseInt(nip.charAt(index)) * weight;
  }, 0);
  const controlNumber = parseInt(nip.charAt(NIP_WEIGHTS.length));

  return (sum % 11) % 10 === controlNumber;
}

/**
 * Validates a NIP (Polish tax identification number) string.
 * This function checks the format of the NIP, ensuring it has either 10 or 13 digits,
 * is not all zeros, and meets a specific checksum requirement. Any dashes or whitespace
 * are ignored.
 *
 * @param {string} nip - The NIP number as a string, which may include dashes or whitespace.
 * @returns {boolean} `true` if the NIP is invalid; `false` otherwise.
 */
export const isNipInvalid = (nip: string) => !isNipValid(nip);
