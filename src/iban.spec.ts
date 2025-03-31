import { getBankNameFromIban, getCountryIbanDataFromIban, isIbanValid } from './iban';

describe('IBAN Validation and Utility Functions', () => {
  describe('isIbanValid', () => {
    it('should return true for a valid IBAN with correct checksum and formatting (Austrian IBAN)', () => {
      // AT611904300234573201 is a known valid Austrian IBAN.
      expect(isIbanValid('PL47 1140 2004 0000 3312 1564 8766')).toBe(true);
    });

    it('should return true for a valid IBAN even with extra whitespace', () => {
      // removeWhitespace should remove spaces so that the IBAN validates.
      expect(isIbanValid('AT61 1904300 234573201')).toBe(true);
    });

    it('should return false for an IBAN with incorrect total length', () => {
      // For Austria, the IBAN length must be 20 characters.
      expect(isIbanValid('AT61190430023457320')).toBe(false);
    });

    it('should return false for a Polish IBAN with an invalid bank code', () => {
      expect(isIbanValid('PL61109910140000071219812874')).toBe(false);
    });

    it('should return false for an IBAN with invalid characters (non-whitespace)', () => {
      // removeWhitespace only removes whitespace; unexpected characters (e.g. dashes) will cause failure.
      expect(isIbanValid('AT61-1904300234573201')).toBe(false);
    });
  });

  describe('getCountryIbanDataFromIban', () => {
    it('should return correct country data when given a valid two-letter country code', () => {
      // The function expects a string that, after cleaning, consists only of two letters.
      expect(getCountryIbanDataFromIban('pl')).toEqual({ country: 'Polska', length: 28 });
      expect(getCountryIbanDataFromIban('AT')).toEqual({ country: 'Austria', length: 20 });
    });

    it('should return correct country data when given an IBAN string (more than two characters)', () => {
      // Since the regex only matches exactly two letters, a full IBAN will not match.
      expect(getCountryIbanDataFromIban('PL47 1140 2004 0000 3312 1564 8766')).toEqual({
        country: 'Polska',
        length: 28,
      });
    });

    it('should return null when given only a single character', () => {
      // Since the regex only matches exactly two letters, a full IBAN will not match.
      expect(getCountryIbanDataFromIban('P')).toBeNull();
    });

    it('should return null for non-existent country', () => {
      // Since the regex only matches exactly two letters, a full IBAN will not match.
      expect(getCountryIbanDataFromIban('XX')).toBeNull();
    });
  });

  describe('getBankNameFromIban', () => {
    it('should return the bank name for a valid Polish IBAN', () => {
      // PL IBAN with bank code "114" should correspond to mBank according to BANK_NAMES.
      // Example: "PL27114020040000300201355387" is a valid Polish IBAN.
      expect(getBankNameFromIban('PL47 1140 2004 0000 3312 1564 8766')).toBe('mBank');
    });

    it('should return null for a non-Polish IBAN', () => {
      // For non-Polish IBANs, the function always returns null.
      expect(getBankNameFromIban('AT611904300234573201')).toBeNull();
    });

    it('should return null for an IBAN that does not match the expected bank data format', () => {
      expect(getBankNameFromIban('INVALIDIBAN')).toBeNull();
    });
  });
});
