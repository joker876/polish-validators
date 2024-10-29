import { isNipValid } from './nip';

describe('NIP', () => {
  it('should return true for a valid NIP with 10 digits', () => {
    expect(isNipValid('1234563218')).toBe(true); // 10-digit
  });

  it('should return true for a valid NIP with 13 digits', () => {
    expect(isNipValid('1234563218123')).toBe(true); // 13-digit
  });

  it('should return true for a valid NIP with dashes and whitespace', () => {
    expect(isNipValid('123-456-32 18')).toBe(true); // with separators
  });

  it('should return false for a NIP with incorrect length', () => {
    expect(isNipValid('123456789')).toBe(false); // 9 digits
    expect(isNipValid('12345678901234')).toBe(false); // 14 digits
  });

  it('should return false for an all-zero NIP', () => {
    expect(isNipValid('0000000000')).toBe(false); // 10 zeros
    expect(isNipValid('0000000000000')).toBe(false); // 13 zeros
  });

  it('should return false for a NIP with non-numeric characters', () => {
    expect(isNipValid('12345678AB')).toBe(false); // contains letters
    expect(isNipValid('12345-678C')).toBe(false); // contains letters with dashes
  });

  it('should return false if control number is incorrect', () => {
    expect(isNipValid('1234563219')).toBe(false); // wrong control number
  });

  it('should return false for an empty string', () => {
    expect(isNipValid('')).toBe(false); // empty string
  });
});
