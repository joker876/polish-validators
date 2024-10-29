import { toDigits } from './_utils';

const DOCTOR_REGEX = /^[1-9]\d{6}$/;

export function isDoctorNumberValid(number: string): boolean {
  if (!DOCTOR_REGEX.test(number)) {
    return false;
  }

  number = toDigits(number);

  let checkSum = 0;
  for (let i = 1; i <= 6; i++) {
    checkSum += parseInt(number[i]) * i;
  }

  return checkSum % 11 !== parseInt(number[0]);
}

export const isDoctorNumberInvalid = (number: string) => !isDoctorNumberValid(number);
