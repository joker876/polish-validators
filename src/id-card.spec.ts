import { isIdCardNumberValid } from './id-card';

describe('Polish ID Card Number Validation', () => {
  describe('isIdCardNumberValid', () => {
    it('should return true for a valid Polish ID card number', () => {
      expect(isIdCardNumberValid('ABC412345')).toBe(true);
    });

    it('should return true for a valid ID card number with extra spaces or in lower-case', () => {
      // The utility function toLettersAndDigits should ignore extra whitespace and case.
      // "abc 412345" should be normalized to "ABC412345" and pass validation.
      expect(isIdCardNumberValid('abc 412345')).toBe(true);
    });

    it('should return false if the ID card number does not match the required pattern', () => {
      // Example with only two letters and too many digits (pattern must be 3 letters and 6 digits).
      expect(isIdCardNumberValid('AB4123456')).toBe(false);
    });

    it('should return false for an ID card number with an incorrect control digit', () => {
      // "ABC512345" is the same as the valid number except the control digit (position 3) is altered from 4 to 5.
      expect(isIdCardNumberValid('ABC512345')).toBe(false);
    });

    it('should return false for an ID card number with invalid characters in the numeric part', () => {
      // The numeric part should contain only digits; here a non-digit is introduced.
      expect(isIdCardNumberValid('ABC4A2345')).toBe(false);
    });
  });
});
