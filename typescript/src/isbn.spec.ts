import { getRegionNameFromIsbn, isIsbnValid } from './isbn';

describe('ISBN', () => {
  describe('isIsbnValid', () => {
    it('should return true for a valid ISBN-10 with digits only', () => {
      expect(isIsbnValid('0306406152')).toBe(true); // ISBN-10
    });

    it('should return true for a valid ISBN-10 with "X" as the check digit', () => {
      expect(isIsbnValid('047195859X')).toBe(true); // ISBN-10 with check digit X
    });

    it('should return true for a valid ISBN-10 with dashes and whitespace', () => {
      expect(isIsbnValid('0-306-40615-2')).toBe(true); // ISBN-10 with separators
      expect(isIsbnValid(' 0  306 40615 2 ')).toBe(true); // ISBN-10 with whitespace
    });

    it('should return true for a valid ISBN-13 with digits only', () => {
      expect(isIsbnValid('9780306406157')).toBe(true); // ISBN-13
    });

    it('should return true for a valid ISBN-13 with dashes and whitespace', () => {
      expect(isIsbnValid('978-0-306-40615-7')).toBe(true); // ISBN-13 with separators
      expect(isIsbnValid(' 978 0 306 40615 7 ')).toBe(true); // ISBN-13 with whitespace
    });

    it('should return false for an invalid ISBN-10 format', () => {
      expect(isIsbnValid('030640615X')).toBe(false); // invalid ISBN-10
    });

    it('should return false for an invalid ISBN-13 format', () => {
      expect(isIsbnValid('9780306406150')).toBe(false); // invalid check digit for ISBN-13
    });

    it('should return false for an ISBN with non-numeric characters', () => {
      expect(isIsbnValid('97A-0-306-40615-7')).toBe(false); // contains letters
      expect(isIsbnValid('97803X406157')).toBe(false); // contains letters
    });

    it('should return false for an ISBN with incorrect length', () => {
      expect(isIsbnValid('123456789')).toBe(false); // too short
      expect(isIsbnValid('97803064061570')).toBe(false); // too long
    });

    it('should return false for an empty string', () => {
      expect(isIsbnValid('')).toBe(false); // empty string
    });
  });

  describe('getRegionNameFromIsbn', () => {
    it('should return the correct region name for a valid ISBN-10', () => {
      expect(getRegionNameFromIsbn('0306406152')).toBe(
        'Angielski (Wielka Brytania, USA, Australia, Nowa Zelandia, Kanada)'
      );
    });

    it('should return the correct region name for a valid ISBN-13', () => {
      expect(getRegionNameFromIsbn('9780306406157')).toBe(
        'Angielski (Wielka Brytania, USA, Australia, Nowa Zelandia, Kanada)'
      );
    });

    it('should return the correct region for a Polish ISBN prefix', () => {
      expect(getRegionNameFromIsbn('8306062159')).toBe('Polska'); // ISBN starting with 83 for Poland
    });

    it('should return null for an unrecognized ISBN region code', () => {
      expect(getRegionNameFromIsbn('99999')).toBe(null); // invalid/unknown region prefix
    });

    it('should return the correct region name for multi-digit region codes', () => {
      expect(getRegionNameFromIsbn('978-9501234558')).toBe('Argentyna'); // ISBN starting with 950 for Argentina
      expect(getRegionNameFromIsbn('979-9971152030')).toBe('Singapur'); // ISBN starting with 9971 for Singapore
    });

    it('should null false for an empty string', () => {
      expect(getRegionNameFromIsbn('')).toBe(null); // empty string
    });
  });
});
