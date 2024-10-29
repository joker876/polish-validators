export function toDigits(value: string): string {
  return value.replace(/[^0-9]/gi, '');
}

export function toLettersAndDigits(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '');
}

export function removeWhitespace(value: string): string {
  return value.replace(/\s/g, '');
}
export function removeDashesAndWhitespace(value: string): string {
  return value.replace(/[-\s]/g, '');
}
export function removeDashesSlashesAndWhitespace(value: string): string {
  return value.replace(/[-/\\\s]/g, '');
}
