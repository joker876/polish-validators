import { removeDashesSlashesAndWhitespace, toDigits } from './_utils';

const IMEI_REGEX = /^\d{15}$/;

export function isImeiValid(imei: string): boolean {
  imei = removeDashesSlashesAndWhitespace(imei);
  if (!IMEI_REGEX.test(imei)) {
    return false;
  }

  imei = toDigits(imei);

  let checkSum = 0;
  let digits = '';
  let v = 0;

  for (let i = 0; i < imei.length; i++) {
    v = parseInt(imei[i]);

    if (i % 2 !== 0) {
      v *= 2;
    }
    digits += v.toString();
  }

  for (let i = 0; i < digits.length; i++) {
    checkSum += parseInt(digits[i]);
  }
  return (checkSum %= 10) === 0;
}

export const isImeiInvalid = (imei: string) => !isImeiValid(imei);
