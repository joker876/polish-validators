import { removeDashesAndWhitespace, toDigits } from './_utils';

const NIP_REGEX = /^\d{10,13}$/;
const NIP_REGEX_ALL_ZEROES = /^0+$/;
const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7];

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

export const isNipInvalid = (nip: string) => !isNipValid(nip);
