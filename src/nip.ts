import { removeDashesAndWhitespace } from './_utils';

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

export const NipFormat = {
  Format3223: '3-2-2-3',
  Format3322: '3-3-2-2',
} as const;
export type NipFormat = (typeof NipFormat)[keyof typeof NipFormat];

const NIP_FORMAT_SETTINGS: Record<NipFormat, [number, number, number]> = {
  [NipFormat.Format3223]: [3, 5, 7],
  [NipFormat.Format3322]: [3, 6, 8],
};

/**
 * Formats a valid NIP into the specified format.
 * @param nip - The NIP as a string or number.
 * @param format - The format to use for the NIP. Defaults to `3-2-2-3`.
 * @returns The formatted NIP string.
 */
export function formatNip(nip: string, format: NipFormat = NipFormat.Format3223): string {
  if (!isNipValid(nip)) {
    return 'Nieprawidłowy NIP';
  }

  nip = removeDashesAndWhitespace(nip);

  const [point1, point2, point3] = NIP_FORMAT_SETTINGS[format];

  return `${nip.substring(0, point1)}-${nip.substring(point1, point2)}-${nip.substring(point2, point3)}-${nip.substring(
    point3,
    10
  )}`;
}
