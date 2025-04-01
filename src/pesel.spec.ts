import { extractSexFromPesel, getBirthdateFromPesel, isPeselValid, PeselSex } from './pesel';

describe('PESEL', () => {
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

  it('should return false for a PESEL with an invalid leap year date', () => {
    expect(isPeselValid('01222901359')).toBe(false); // PESEL with 29 Feb 2000 (leap year)
  });

  it('should return false for an empty string', () => {
    expect(isPeselValid('')).toBe(false); // empty string
  });
});

describe('getBirthdateFromPesel', () => {
  it('should extract the correct birthdate from a valid PESEL - years 1900-2000', () => {
    const birthdate = getBirthdateFromPesel('44051401359');

    expect(birthdate.getFullYear()).toBe(1944);
    expect(birthdate.getMonth()).toBe(4); // 0-indexed
    expect(birthdate.getDate()).toBe(14);
  });

  it('should extract the correct birthdate from a valid PESEL - years 2000-2100', () => {
    const birthdate = getBirthdateFromPesel('03251401352');

    expect(birthdate.getFullYear()).toBe(2003);
    expect(birthdate.getMonth()).toBe(4); // 0-indexed
    expect(birthdate.getDate()).toBe(14);
  });

  it('should extract the correct birthdate from a valid PESEL - years 2100-2200', () => {
    const birthdate = getBirthdateFromPesel('03451401358');

    expect(birthdate.getFullYear()).toBe(2103);
    expect(birthdate.getMonth()).toBe(4); // 0-indexed
    expect(birthdate.getDate()).toBe(14);
  });

  it('should extract the correct birthdate from a valid PESEL - years 2200-2300', () => {
    const birthdate = getBirthdateFromPesel('03651401354');

    expect(birthdate.getFullYear()).toBe(2203);
    expect(birthdate.getMonth()).toBe(4); // 0-indexed
    expect(birthdate.getDate()).toBe(14);
  });

  it('should extract the correct birthdate from a valid PESEL - years 1800-1900', () => {
    const birthdate = getBirthdateFromPesel('99851401353');

    expect(birthdate.getFullYear()).toBe(1899);
    expect(birthdate.getMonth()).toBe(4); // 0-indexed
    expect(birthdate.getDate()).toBe(14);
  });

  it('should throw an error for an invalid PESEL', () => {
    expect(() => getBirthdateFromPesel('00000000000')).toThrow();
  });
});

describe('extractSexFromPesel', () => {
  it('should extract "male" for a PESEL with an odd tenth digit', () => {
    expect(extractSexFromPesel('44051401359')).toBe(PeselSex.Male);
  });

  it('should extract "female" for a PESEL with an even tenth digit', () => {
    expect(extractSexFromPesel('44051401366')).toBe(PeselSex.Female);
  });

  it('should throw an error for an invalid PESEL', () => {
    expect(() => extractSexFromPesel('00000000000')).toThrow();
  });
});
