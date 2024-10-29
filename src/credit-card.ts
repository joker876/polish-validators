import { removeWhitespace, toDigits } from './_utils';

const CREDIT_CARD_REGEX = /^\d{16}$/;

export function isCreditCardNumberValid(number: string): boolean {
  number = removeWhitespace(number);
  if (!CREDIT_CARD_REGEX.test(number)) {
    return false;
  }

  number = toDigits(number);

  let checkSum = 0;
  let digits = '';
  let v = 0;

  for (let i = 0; i < number.length; i++) {
    v = parseInt(number[i]);

    if (i % 2 === 0) {
      v *= 2;
    }

    digits += v.toString();
  }

  for (let i = 0; i < digits.length; i++) {
    checkSum += parseInt(digits[i]);
  }

  return checkSum % 10 === 0;
}

export const isCreditCardNumberInvalid = (number: string) => !isCreditCardNumberValid(number);

export const CreditCardType = {
  Airline: 'airline',
  ClubCard: 'clubcard',
  Visa: 'Visa',
  MasterCard: 'mastercard',
  Finances: 'finances',
  Fuel: 'fuel',
  Telecommunication: 'telecommunication',
  Other: 'other',
} as const;
export type CreditCardType = (typeof CreditCardType)[keyof typeof CreditCardType];

export function getCreditCardType(number: string): CreditCardType | null {
  switch (parseInt(number[0])) {
    case 1:
    case 2:
      return CreditCardType.Airline;
    case 3:
      return CreditCardType.ClubCard;
    case 4:
      return CreditCardType.Visa;
    case 5:
      return CreditCardType.MasterCard;
    case 6:
      return CreditCardType.Finances;
    case 7:
      return CreditCardType.Fuel;
    case 8:
      return CreditCardType.Telecommunication;
    case 9:
      return CreditCardType.Other;
    default:
      return null;
  }
}
