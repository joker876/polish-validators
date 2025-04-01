export function removeWhitespace(value: string): string {
  return value.replace(/\s/g, '');
}
export function removeDashesAndWhitespace(value: string): string {
  return value.replace(/[-\s]/g, '');
}
export function removeDashesSlashesAndWhitespace(value: string): string {
  return value.replace(/[-/\\\s]/g, '');
}
