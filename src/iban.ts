import { removeWhitespace, toLettersAndDigits } from './_utils';

const IBAN_COUNTRY_DATA: Record<string, { country: string; length: number }> = {
  AL: { country: 'Albania', length: 28 },
  AD: { country: 'Andora', length: 24 },
  AT: { country: 'Austria', length: 20 },
  AZ: { country: 'Azerbejdżan', length: 28 },
  BH: { country: 'Bahrajn', length: 22 },
  BY: { country: 'Białoruś', length: 28 },
  BE: { country: 'Belgia', length: 16 },
  BA: { country: 'Bośnia i Hercegowina', length: 20 },
  BR: { country: 'Brazylia', length: 29 },
  BG: { country: 'Bułgaria', length: 22 },
  BI: { country: 'Burundi', length: 27 },
  CR: { country: 'Kostaryka', length: 22 },
  HR: { country: 'Chorwacja', length: 21 },
  CY: { country: 'Cypr', length: 28 },
  CZ: { country: 'Czechy', length: 24 },
  DK: { country: 'Dania', length: 18 },
  DJ: { country: 'Dżibuti', length: 27 },
  DO: { country: 'Dominikana', length: 28 },
  EG: { country: 'Egipt', length: 29 },
  SV: { country: 'Salwador', length: 28 },
  EE: { country: 'Estonia', length: 20 },
  FK: { country: 'Falklandy', length: 18 },
  FO: { country: 'Wyspy Owcze', length: 18 },
  FI: { country: 'Finlandia', length: 18 },
  FR: { country: 'Francja', length: 27 },
  GE: { country: 'Gruzja', length: 22 },
  DE: { country: 'Niemcy', length: 22 },
  GI: { country: 'Gibraltar', length: 23 },
  GR: { country: 'Grecja', length: 27 },
  GL: { country: 'Grenlandia', length: 18 },
  GT: { country: 'Gwatemala', length: 28 },
  VA: { country: 'Watykan', length: 22 },
  HU: { country: 'Węgry', length: 28 },
  IS: { country: 'Islandia', length: 26 },
  IQ: { country: 'Irak', length: 23 },
  IE: { country: 'Irlandia', length: 22 },
  IL: { country: 'Izrael', length: 23 },
  IT: { country: 'Włochy', length: 27 },
  JO: { country: 'Jordania', length: 30 },
  KZ: { country: 'Kazachstan', length: 20 },
  XK: { country: 'Kosowo', length: 20 },
  KW: { country: 'Kuwejt', length: 30 },
  LV: { country: 'Łotwa', length: 21 },
  LB: { country: 'Liban', length: 28 },
  LY: { country: 'Libia', length: 25 },
  LI: { country: 'Liechtenstein', length: 21 },
  LT: { country: 'Litwa', length: 20 },
  LU: { country: 'Luksemburg', length: 20 },
  MT: { country: 'Malta', length: 31 },
  MR: { country: 'Mauretania', length: 27 },
  MU: { country: 'Mauritius', length: 30 },
  MD: { country: 'Mołdawia', length: 24 },
  MC: { country: 'Monako', length: 27 },
  MN: { country: 'Mongolia', length: 20 },
  ME: { country: 'Czarnogóra', length: 22 },
  NL: { country: 'Holandia', length: 18 },
  NI: { country: 'Nikaragua', length: 28 },
  MK: { country: 'Macedonia Północna', length: 19 },
  NO: { country: 'Norwegia', length: 15 },
  PK: { country: 'Pakistan', length: 24 },
  PS: { country: 'Palestyna', length: 29 },
  PL: { country: 'Polska', length: 28 },
  PT: { country: 'Portugalia', length: 25 },
  QA: { country: 'Katar', length: 29 },
  RO: { country: 'Rumunia', length: 24 },
  RU: { country: 'Rosja', length: 33 },
  LC: { country: 'Saint Lucia', length: 32 },
  SM: { country: 'San Marino', length: 27 },
  ST: { country: 'Wyspy Świętego Tomasza i Książęca', length: 25 },
  SA: { country: 'Arabia Saudyjska', length: 24 },
  RS: { country: 'Serbia', length: 22 },
  SC: { country: 'Seszele', length: 31 },
  SK: { country: 'Słowacja', length: 24 },
  SI: { country: 'Słowenia', length: 19 },
  SO: { country: 'Somalia', length: 23 },
  ES: { country: 'Hiszpania', length: 24 },
  SD: { country: 'Sudan', length: 18 },
  OM: { country: 'Oman', length: 23 },
  SE: { country: 'Szwecja', length: 24 },
  CH: { country: 'Szwajcaria', length: 21 },
  TL: { country: 'Timor Wschodni', length: 23 },
  TN: { country: 'Tunezja', length: 24 },
  TR: { country: 'Turcja', length: 26 },
  UA: { country: 'Ukraina', length: 29 },
  AE: { country: 'Zjednoczone Emiraty Arabskie', length: 23 },
  GB: { country: 'Wielka Brytania', length: 22 },
  VG: { country: 'Brytyjskie Wyspy Dziewicze', length: 24 },
  YE: { country: 'Jemen', length: 30 },
};
const BANK_NAMES: Record<string, string> = {
  '101': 'Narodowy Bank Polski',
  '102': 'PKO BP',
  '103': 'Bank Handlowy (Citi Handlowy)',
  '105': 'ING Bank Śląski',
  '109': 'Santander Bank Polska',
  '113': 'BGK',
  '114': 'mBank',
  '116': 'Bank Millennium',
  '124': 'Pekao SA',
  '132': 'Bank Pocztowy',
  '154': 'BOŚ Bank',
  '158': 'Mercedes-Benz Bank Polska',
  '161': 'SGB - Bank',
  '167': 'RBS Bank (Polska)',
  '168': 'Plus Bank',
  '184': 'Societe Generale',
  '187': 'Nest Bank',
  '193': 'Bank Polskiej Spółdzielczości',
  '194': 'Credit Agricole Bank Polska',
  '203': 'BNP Paribas',
  '212': 'Santander Consumer Bank',
  '216': 'Toyota Bank',
  '219': 'DNB Bank Polska',
  '248': 'Getin Noble Bank',
  '249': 'Alior Bank',
  '271': 'FCE Bank Polska',
  '272': 'Inbank',
  '277': 'Volkswagen Bank',
  '280': 'HSBC',
  '291': 'Aion Bank',
};
const IBAN_REGEX = /^([A-Z]{2})?(\d{2})(\d{3})(\d{8,25})$/i;
const IBAN_COUNTRY_ONLY_REGEX = /^([A-Z]{2})$/i;
const IBAN_BANK_DATA_REGEX = /^(?:[A-Z]{2})?\d{2}(\d{3})/i;

function _modulo(number: string, mod: number): number {
  let result = 0;
  for (let i = 0; i < number.length; i++) {
    result = parseInt(result.toString() + number[i]) % mod;
  }
  return result;
}

export function isIbanValid(iban: string): boolean {
  iban = removeWhitespace(iban);
  if (!IBAN_REGEX.test(iban)) {
    return false;
  }

  iban = toLettersAndDigits(iban).toUpperCase();

  const [, countryCode = 'PL', controlSum, bankNameNumber, rest] = iban.match(IBAN_REGEX)!;

  if (!IBAN_COUNTRY_DATA[countryCode] || iban.length !== IBAN_COUNTRY_DATA[countryCode].length) {
    return false;
  }

  if (countryCode === 'PL') {
    if (!BANK_NAMES[bankNameNumber]) {
      return false;
    }
  }

  iban = rest + (countryCode.charCodeAt(0) - 55) + (countryCode.charCodeAt(1) - 55) + controlSum;
  const checkSum = _modulo(iban, 97);

  return checkSum === 1;
}

export const isIbanInvalid = (iban: string) => !isIbanValid(iban);

export function getCountryIbanDataFromIban(iban: string): { country: string; length: number } | null {
  iban = toLettersAndDigits(iban).toUpperCase();

  const result = iban.match(IBAN_COUNTRY_ONLY_REGEX);
  if (!result) {
    return null;
  }

  const [, countryCode] = result;

  return IBAN_COUNTRY_DATA[countryCode] ?? null;
}

export function getBankNameFromIban(iban: string): string | null {
  iban = toLettersAndDigits(iban).toUpperCase();

  const result = iban.match(IBAN_BANK_DATA_REGEX);
  if (!result) {
    return null;
  }
  const [, countryCode = 'PL', bankNameNumber] = result;

  if (countryCode !== 'PL') {
    return null;
  }
  return BANK_NAMES[bankNameNumber] ?? null;
}
