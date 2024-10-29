import { isPeselInvalid, isPeselValid } from './pesel';

describe('PESEL Validation', () => {
  describe('isPeselValid', () => {
    it('should return true for a valid PESEL number', () => {
      expect(isPeselValid('44051401359')).toBe(true);
    });

    it('should return false for a PESEL with incorrect length', () => {
      expect(isPeselValid('1234567890')).toBe(false); // 10 digits
      expect(isPeselValid('123456789012')).toBe(false); // 12 digits
    });

    it('should return false for a PESEL containing non-numeric characters', () => {
      expect(isPeselValid('4405140135A')).toBe(false);
      expect(isPeselValid('1234567A901')).toBe(false);
    });

    it('should return false for an all-zero PESEL', () => {
      expect(isPeselValid('00000000000')).toBe(false);
    });

    it('should return false if control number is incorrect', () => {
      expect(isPeselValid('44051401358')).toBe(false); // wrong control number
    });

    it('should return false for a PESEL with an invalid date', () => {
      expect(isPeselValid('44043201359')).toBe(false); // invalid day (32)
      expect(isPeselValid('44990501359')).toBe(false); // invalid month (99)
    });

    it('should return true for a PESEL with a valid date in the 1800s', () => {
      expect(isPeselValid('80123101354')).toBe(true); // PESEL with 23 Sept 1880
    });

    it('should return true for a PESEL with a valid leap year date', () => {
      expect(isPeselValid('00222901352')).toBe(true); // PESEL with 29 Feb 2000 (leap year)
    });
  });

  describe('isPeselInvalid', () => {
    it('should return true for an invalid PESEL number', () => {
      expect(isPeselInvalid('1234567890')).toBe(true); // Invalid length
      expect(isPeselInvalid('00000000000')).toBe(true); // All zeros
      expect(isPeselInvalid('4405140135A')).toBe(true); // Contains non-numeric
      expect(isPeselInvalid('44051401358')).toBe(true); // Incorrect control number
      expect(isPeselInvalid('44043201359')).toBe(true); // Invalid day (32 for April)
    });

    it('should return false for a valid PESEL number', () => {
      expect(isPeselInvalid('44051401359')).toBe(false); // Valid PESEL
    });

    it('should return true for a PESEL with an invalid leap year date', () => {
      expect(isPeselInvalid('01222901359')).toBe(true); // PESEL with 29 Feb 2000 (leap year)
    });
  });
});
