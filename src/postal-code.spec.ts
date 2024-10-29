import { isPostalCodeValid } from './postal-code';

describe('Postal Code', () => {
  it('should return true for a correctly formatted postal code with a dash', () => {
    expect(isPostalCodeValid('12-345')).toBe(true); // with dash
  });

  it('should return true for a correctly formatted postal code without a dash', () => {
    expect(isPostalCodeValid('12345')).toBe(true); // without dash
  });

  it('should return true for valid postal codes with leading zeros', () => {
    expect(isPostalCodeValid('00-001')).toBe(true); // with dash
    expect(isPostalCodeValid('00001')).toBe(true); // without dash
  });

  it('should return false for a postal code with an incorrect dash position', () => {
    expect(isPostalCodeValid('123-45')).toBe(false); // dash in wrong position
    expect(isPostalCodeValid('1-2345')).toBe(false); // dash in wrong position
  });

  it('should return false for valid postal codes but with other characters instead of a dash', () => {
    expect(isPostalCodeValid('00/001')).toBe(false); // with slash
    expect(isPostalCodeValid('00 001')).toBe(false); // with space
    expect(isPostalCodeValid('00_001')).toBe(false); // with underscore
    expect(isPostalCodeValid('00\\001')).toBe(false); // with backslash
    expect(isPostalCodeValid('00.001')).toBe(false); // with dot
    expect(isPostalCodeValid('00,001')).toBe(false); // with comma
  });

  it('should return false for a postal code with extra digits', () => {
    expect(isPostalCodeValid('123-456')).toBe(false); // too many digits
    expect(isPostalCodeValid('123456')).toBe(false); // too many digits without dash
  });

  it('should return false for a postal code with non-numeric characters', () => {
    expect(isPostalCodeValid('12-34A')).toBe(false); // contains letter
    expect(isPostalCodeValid('AB-345')).toBe(false); // letters instead of digits
  });

  it('should return false for an empty string', () => {
    expect(isPostalCodeValid('')).toBe(false); // empty string
  });
});
