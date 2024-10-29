const PESEL_REGEX = /^\d{11}$/;
const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

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

  const year = parseInt(pesel.substring(0, 2));
  const month = parseInt(pesel.substring(2, 4));
  const day = parseInt(pesel.substring(4, 6));

  let fullYear = 1900 + year;
  if (month >= 81 && month <= 92) {
    fullYear = 1800 + year;
  } else if (month >= 21 && month <= 32) {
    fullYear = 2000 + year;
  } else if (month >= 41 && month <= 52) {
    fullYear = 2100 + year;
  } else if (month >= 61 && month <= 72) {
    fullYear = 2200 + year;
  }
  const adjustedMonth = month % 20 || month;

  const date = new Date(fullYear, adjustedMonth - 1, day);
  if (date.getFullYear() !== fullYear || date.getMonth() + 1 !== adjustedMonth || date.getDate() !== day) {
    return false;
  }
  return true;
}

export const isPeselInvalid = (pesel: string) => !isPeselValid(pesel);
