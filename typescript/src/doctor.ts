
const DOCTOR_REGEX = /^[1-9]\d{6}$/;

/**
 * Validates a doctor's identifier in Poland, ensuring it has 7 digits and passes a
 * checksum validation. Any characters other than digits will result in the identifier
 * being invalid.
 *
 * @param {string} number - The doctor's identification number as a string.
 * @returns {boolean} `true` if the doctor's number is valid; `false` otherwise.
 */
export function isDoctorNumberValid(number: string): boolean {
  if (!DOCTOR_REGEX.test(number)) {
    return false;
  }

  let checkSum = 0;
  for (let i = 1; i <= 6; i++) {
    checkSum += parseInt(number[i]) * i;
  }

  return checkSum % 11 !== parseInt(number[0]);
}

/**
 * Validates a doctor's identifier in Poland, ensuring it has 7 digits and passes a
 * checksum validation. Any characters other than digits will result in the identifier
 * being invalid.
 *
 * @param {string} number - The doctor's identification number as a string.
 * @returns {boolean} `true` if the doctor's number is invalid; `false` otherwise.
 */
export const isDoctorNumberInvalid = (number: string) => !isDoctorNumberValid(number);
