const PESEL_REGEX = /^\d{11}$/;
const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

/**
 * Validates a PESEL (Polish national identification number) string.
 * This function validates the control number and ensures the birthdate is also valid.
 *
 * **Note:** This validator isn't perfect. Some invalid numbers might still return true.
 * For example, people born before the year 1931 might accidentally swap their birthyear
 * and birthday, and the function will still pass. 1st, 5th, and 9th or 2nd, 6th, and
 * 10th numbers may also be swapped while still passing. There is nothing that can really
 * be done about that, other than validating against a database of PESEL numbers.
 *
 * @param {string} pesel - The 11-digit PESEL number as a string.
 * @returns {boolean} `true` if the PESEL is valid; `false` otherwise.
 */
export function isPeselValid(pesel: string): boolean {
  if (!PESEL_REGEX.test(pesel) || pesel === '0'.repeat(11)) {
    return false;
  }

  const sum = PESEL_WEIGHTS.reduce((acc, weight, index) => {
    return acc + parseInt(pesel.charAt(index)) * weight;
  }, 0);
  const controlNumber = parseInt(pesel.charAt(10));

  if ((10 - (sum % 10)) % 10 !== controlNumber) {
    return false;
  }

  const [year, monthIndex, day] = _getDatePartsFromPesel(pesel);

  const date = new Date(year, monthIndex, day);
  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return false;
  }
  return true;
}

function _getDatePartsFromPesel(pesel: string): [number, number, number] {
  const yearPart = parseInt(pesel.substring(0, 2), 10);
  const monthPart = parseInt(pesel.substring(2, 4), 10);
  const dayPart = parseInt(pesel.substring(4, 6), 10);

  let fullYear = 1900 + yearPart;
  if (monthPart >= 81 && monthPart <= 92) {
    fullYear = 1800 + yearPart;
  } else if (monthPart >= 21 && monthPart <= 32) {
    fullYear = 2000 + yearPart;
  } else if (monthPart >= 41 && monthPart <= 52) {
    fullYear = 2100 + yearPart;
  } else if (monthPart >= 61 && monthPart <= 72) {
    fullYear = 2200 + yearPart;
  }

  const adjustedMonth = monthPart % 20 || monthPart;

  return [fullYear, adjustedMonth - 1, dayPart];
}

/**
 * Validates a PESEL (Polish national identification number) string.
 * This function validates the control number and ensures the birthdate is also valid.
 *
 * **Note:** This validator isn't perfect. Some invalid numbers might still return true.
 * For example, people born before the year 1931 might accidentally swap their birthyear
 * and birthday, and the function will still pass. 1st, 5th, and 9th or 2nd, 6th, and
 * 10th numbers may also be swapped while still passing. There is nothing that can really
 * be done about that, other than validating against a database of PESEL numbers.
 *
 * @param {string} pesel - The 11-digit PESEL number as a string.
 * @returns {boolean} `true` if the PESEL is invalid; `false` otherwise.
 */
export const isPeselInvalid = (pesel: string) => !isPeselValid(pesel);

/**
 * Extracts the birthdate from a valid PESEL number.
 * @param pesel - The 11-digit PESEL number as a string.
 * @returns The birthdate as a Date object.
 * @throws Error if the PESEL is invalid.
 */
export function getBirthdateFromPesel(pesel: string): Date {
  if (!isPeselValid(pesel)) {
    throw new Error('Trying to extract a birthdate from an invalid PESEL number');
  }

  const [year, monthIndex, day] = _getDatePartsFromPesel(pesel);

  return new Date(year, monthIndex, day);
}

export const PeselSex = {
  Male: 'male',
  Female: 'female',
} as const;
export type PeselSex = (typeof PeselSex)[keyof typeof PeselSex];

/**
 * Extracts the sex from a valid PESEL number.
 * @param pesel - The 11-digit PESEL number as a string.
 * @returns 'male' if the PESEL belongs to a male, 'female' if it belongs to a female.
 * @throws Error if the PESEL is invalid.
 */
export function extractSexFromPesel(pesel: string): PeselSex {
  if (!isPeselValid(pesel)) {
    throw new Error('Trying to extract a birthdate from an invalid PESEL number');
  }

  const sexDigit = parseInt(pesel.charAt(9), 10);

  return sexDigit % 2 === 0 ? PeselSex.Female : PeselSex.Male;
}
