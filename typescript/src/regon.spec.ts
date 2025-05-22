import { isRegonValid } from './regon';

describe('REGON', () => {
  it('should return true for a valid 9-digit REGON number', () => {
    expect(isRegonValid('123456785')).toBe(true); // 9-digit
  });

  it('should return true for a valid 14-digit REGON number', () => {
    expect(isRegonValid('12345678512347')).toBe(true); // 14-digit
  });

  it('should return true for a valid REGON with dashes and whitespace', () => {
    expect(isRegonValid('123-456-785')).toBe(true); // 9-digit with separators
    expect(isRegonValid('123-456-785 123 47')).toBe(true); // 14-digit with separators
  });

  it('should return false for a REGON with incorrect control number (9 digits)', () => {
    expect(isRegonValid('123456786')).toBe(false); // wrong control number for 9-digit REGON
  });

  it('should return false for a REGON with incorrect control number (14 digits)', () => {
    expect(isRegonValid('12345678512348')).toBe(false); // wrong control number for 14-digit REGON
  });

  it('should return false for a REGON with an invalid length', () => {
    expect(isRegonValid('12345678')).toBe(false); // 8 digits
    expect(isRegonValid('123456785123')).toBe(false); // 12 digits
    expect(isRegonValid('1234567851234789')).toBe(false); // 16 digits
  });

  it('should return false for a REGON that is all zeros', () => {
    expect(isRegonValid('000000000')).toBe(false); // 9 zeros
    expect(isRegonValid('00000000000000')).toBe(false); // 14 zeros
  });

  it('should return false for a REGON with non-numeric characters', () => {
    expect(isRegonValid('12345678A')).toBe(false); // contains letters
    expect(isRegonValid('1234-5678A5')).toBe(false); // contains letters with dashes
  });

  it('should return false for an empty string', () => {
    expect(isRegonValid('')).toBe(false); // empty string
  });
});
