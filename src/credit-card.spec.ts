import { CreditCardType, getCreditCardType, isCreditCardNumberValid } from './credit-card';

describe('isCreditCardNumberValid', () => {
  it('should return true for a valid credit card number without dashes/whitespace', () => {
    expect(isCreditCardNumberValid('4111111111111111')).toBe(true);
  });

  it('should return true for a valid credit card number with dashes', () => {
    expect(isCreditCardNumberValid('4111-1111-1111-1111')).toBe(true);
  });

  it('should return true for a valid credit card number with spaces', () => {
    expect(isCreditCardNumberValid('4111 1111 1111 1111')).toBe(true);
  });

  it('should return false for an invalid credit card number (fails Luhn algorithm)', () => {
    expect(isCreditCardNumberValid('4111111111111112')).toBe(false);
  });

  it('should return false if the number contains non-digit characters', () => {
    expect(isCreditCardNumberValid('4111-1111-1111-111a')).toBe(false);
  });

  it('should return false if the number has less than 16 digits', () => {
    expect(isCreditCardNumberValid('411111111111111')).toBe(false);
  });
});

describe('getCreditCardType', () => {
  it('should return Airline for numbers starting with 1 or 2', () => {
    expect(getCreditCardType('1111111111111111')).toBe(CreditCardType.Airline);
    expect(getCreditCardType('2111111111111111')).toBe(CreditCardType.Airline);
  });

  it('should return ClubCard for numbers starting with 3', () => {
    expect(getCreditCardType('3111111111111111')).toBe(CreditCardType.ClubCard);
  });

  it('should return Visa for numbers starting with 4', () => {
    expect(getCreditCardType('4111111111111111')).toBe(CreditCardType.Visa);
  });

  it('should return MasterCard for numbers starting with 5', () => {
    expect(getCreditCardType('5111111111111111')).toBe(CreditCardType.MasterCard);
  });

  it('should return Finances for numbers starting with 6', () => {
    expect(getCreditCardType('6111111111111111')).toBe(CreditCardType.Finances);
  });

  it('should return Fuel for numbers starting with 7', () => {
    expect(getCreditCardType('7111111111111111')).toBe(CreditCardType.Fuel);
  });

  it('should return Telecommunication for numbers starting with 8', () => {
    expect(getCreditCardType('8111111111111111')).toBe(CreditCardType.Telecommunication);
  });

  it('should return Other for numbers starting with 9', () => {
    expect(getCreditCardType('9111111111111111')).toBe(CreditCardType.Other);
  });

  it('should return null if the first character is non-numeric', () => {
    expect(getCreditCardType('a1111111111111111')).toBeNull();
  });

  it('should return null for an empty string', () => {
    expect(getCreditCardType('')).toBeNull();
  });

  it('should return null for numbers starting with 0', () => {
    expect(getCreditCardType('0111111111111111')).toBeNull();
  });
});
