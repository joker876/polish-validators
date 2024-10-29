const POSTAL_CODE_REGEX = /\d{2}-\d{3}/;

export function isPostalCodeValid(code: string): boolean {
  return POSTAL_CODE_REGEX.test(code);
}

export const isPostalCodeInvalid = (code: string) => !isPostalCodeValid(code);
