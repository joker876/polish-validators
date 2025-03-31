import { isDoctorNumberInvalid, isDoctorNumberValid } from './doctor';

describe('isDoctorNumberValid', () => {
  it('should return false if the number contains non-digit characters', () => {
    expect(isDoctorNumberValid('A234567')).toBe(false);
  });

  it('should return false if the number does not have exactly 7 digits', () => {
    expect(isDoctorNumberValid('123456')).toBe(false);
    expect(isDoctorNumberValid('12345678')).toBe(false);
  });

  it('should return true for a valid doctor number', () => {
    expect(isDoctorNumberValid('1234567')).toBe(true);
  });

  it('should return false for a doctor number that fails the checksum validation', () => {
    expect(isDoctorNumberValid('2234567')).toBe(false);
  });

  it('should have isDoctorNumberInvalid return the inverse of isDoctorNumberValid', () => {
    expect(isDoctorNumberInvalid('1234567')).toBe(false);
    expect(isDoctorNumberInvalid('2234567')).toBe(true);
  });
});
