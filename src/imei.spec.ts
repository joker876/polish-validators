import { isImeiValid } from './imei';

describe('IMEI', () => {
  describe('isImeiValid', () => {
    it('should return true for a valid 15-digit IMEI', () => {
      expect(isImeiValid('490154203237518')).toBe(true);
    });

    it('should return true for a valid IMEI with dashes, slashes, and whitespace', () => {
      expect(isImeiValid('49-015420 32375/18')).toBe(true);
    });

    it('should return false for an IMEI with less than 15 digits', () => {
      expect(isImeiValid('49015420323751')).toBe(false);
    });

    it('should return false for an IMEI with more than 15 digits', () => {
      expect(isImeiValid('4901542032375189')).toBe(false);
    });

    it('should return false for an IMEI containing non-digit characters', () => {
      expect(isImeiValid('49015420323751a')).toBe(false);
    });
  });
});
