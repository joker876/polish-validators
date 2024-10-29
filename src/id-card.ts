import { toLettersAndDigits } from './_utils';

const ID_CARD_CHARACTER_VALUES: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 18,
  J: 19,
  K: 20,
  L: 21,
  M: 22,
  N: 23,
  O: 24,
  P: 25,
  Q: 26,
  R: 27,
  S: 28,
  T: 29,
  U: 30,
  V: 31,
  W: 32,
  X: 33,
  Y: 34,
  Z: 35,
};
const ID_CARD_WEIGHTS = [7, 3, 1, 9, 7, 3, 1, 7, 3];
const ID_CARD_REGEX = /^[A-Z]{3}\s*\d{6}$/i;

export function isIdCardNumberValid(number: string): boolean {
  if (!ID_CARD_REGEX.test(number)) {
    return false;
  }
  
  number = toLettersAndDigits(number);

  let sum = 0;
  for (let i = 0; i < ID_CARD_WEIGHTS.length; i++) {
    if (i === 3) continue;

    sum += ID_CARD_CHARACTER_VALUES[number.charAt(i)] * ID_CARD_WEIGHTS[i];
  }
  const controlNumber = parseInt(number.charAt(3));

  return sum % 10 === controlNumber;
}

export const isIdCardNumberInvalid = (number: string) => !isIdCardNumberValid(number);