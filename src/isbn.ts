import { removeDashesAndWhitespace, toDigits, toLettersAndDigits } from './_utils';

const ISBN_REGION_CODES: Record<string, string> = {
  '0': 'Angielski (Wielka Brytania, USA, Australia, Nowa Zelandia, Kanada)',
  '1': 'Angielski (Republika Południowej Afryki, Zimbabwe)',
  '2': 'Francuski (Francja, Belgia, Kanada, Szwajcaria)',
  '3': 'Niemiecki (Niemcy, Austria, Szwajcaria)',
  '4': 'Japonia',
  '5': 'ZSRR',
  '7': 'Chiny',
  '80': 'Czechosłowacja',
  '81': 'Indie', // see also 93
  '82': 'Norwegia',
  '83': 'Polska',
  '84': 'Hiszpania',
  '85': 'Brazylia',
  '86': 'Jugosławia',
  '87': 'Dania',
  '88': 'Włoski (Włochy, Szwajcaria)',
  '89': 'Korea Południowa',
  '90': 'Holenderski/Flemish',
  '91': 'Szwecja',
  '92': 'Międzynarodowy (UNESCO)',
  '93': 'Indie', // see also 81
  '950': 'Argentyna',
  '951': 'Finlandia',
  '952': 'Finlandia',
  '953': 'Chorwacja',
  '954': 'Bułgaria',
  '955': 'Sri Lanka',
  '956': 'Chile',
  '957': 'Tajwan',
  '958': 'Kolumbia',
  '959': 'Kuba',
  '960': 'Grecja',
  '961': 'Słowenia',
  '962': 'Hongkong',
  '963': 'Węgry',
  '964': 'Iran',
  '965': 'Izrael',
  '967': 'Malezja', // see also 983
  '968': 'Meksyk', // see also 970
  '969': 'Pakistan',
  '970': 'Meksyk', // see also 968
  '971': 'Filipiny',
  '972': 'Portugalia',
  '973': 'Rumunia',
  '974': 'Tajlandia',
  '975': 'Turcja',
  '976': 'Karaiby: AG, BS, BB, BZ, DM, GD, GY, JM, MS, KN, LC, VC, TT',
  '977': 'Egipt',
  '978': 'Nigeria',
  '979': 'Indonezja',
  '980': 'Wenezuela',
  '981': 'Singapur', // see also 9971
  '982': 'Pacyfik: CK, FJ, KI, NR, NU, SB, TK, TO, TV, VU, WS',
  '983': 'Malezja', // see also 967
  '984': 'Bangladesz',
  '985': 'Białoruś',
  '987': 'Argentyna',
  '9960': 'Arabia Saudyjska',
  '9963': 'Cypr',
  '9964': 'Ghana',
  '9966': 'Kenia',
  '9968': 'Kostaryka', // see also 9977
  '9970': 'Uganda',
  '9971': 'Singapur', // see also 981
  '9972': 'Syria',
  '9973': 'Tunezja',
  '9974': 'Urugwaj',
  '9976': 'Tanzania', // see also 9987
  '9977': 'Kostaryka', // see also 9968
  '9978': 'Ekwador',
  '9979': 'Islandia',
  '9980': 'Papua-Nowa Gwinea',
  '9981': 'Maroko',
  '9982': 'Zambia',
  '9983': 'Gambia',
  '9984': 'Łotwa',
  '9985': 'Estonia',
  '9986': 'Litwa',
  '9987': 'Tanzania', // see also 9976
  '9988': 'Ghana',
  '9989': 'Macedonia',
  '99903': 'Mauritius',
  '99904': 'Antyle Holenderskie',
  '99908': 'Malawi',
  '99909': 'Malta',
  '99911': 'Lesotho',
  '99912': 'Botswana',
  '99913': 'Andora', // see also 99920
  '99914': 'Surinam',
  '99915': 'Malediwy',
  '99916': 'Namibia',
  '99917': 'Brunei',
  '99920': 'Andora', // see also 99913
  '99921': 'Katar',
};
const ISBN_REGEX = /^(((978|979)\d{10})|(\d{9}(\d|X)))$/i;
const ISBN_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2];

function _isIsbn10Valid(isbn: string): boolean {
  let checkSum = 0;

  for (let i = 0; i < ISBN_WEIGHTS.length; i++) {
    checkSum += parseInt(isbn[i]) * ISBN_WEIGHTS[i];
  }

  const ctrlSum = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
  return (11 - (checkSum % 11)) % 11 === ctrlSum;
}

function _isIsbn13Valid(isbn: string): boolean {
  let checkSum = 0;
  let v = 0;

  for (let i = 0; i < 12; i++) {
    v = parseInt(isbn[i]);

    if (i % 2 !== 0) {
      v *= 3;
    }
    checkSum += v;
  }

  return (10 - (checkSum % 10)) % 10 === parseInt(isbn.charAt(12));
}

/**
 * Validates an ISBN (International Standard Book Number), supporting both ISBN-10 and
 * ISBN-13 formats. Ensures that the ISBN has the correct format and checksum. Any dashes
 * or whitespace are ignored.
 *
 * @param {string} isbn - The ISBN as a string.
 * @returns {boolean} `true` if the ISBN is valid; `false` otherwise.
 */
export function isIsbnValid(isbn: string): boolean {
  isbn = removeDashesAndWhitespace(isbn);
  if (!ISBN_REGEX.test(isbn)) {
    return false;
  }

  isbn = toLettersAndDigits(isbn).toUpperCase();

  if (isbn.length === 10) {
    return _isIsbn10Valid(isbn);
  }
  return _isIsbn13Valid(isbn);
}

/**
 * Validates an ISBN (International Standard Book Number), supporting both ISBN-10 and
 * ISBN-13 formats. Ensures that the ISBN has the correct format and checksum. Any dashes
 * or whitespace are ignored.
 *
 * @param {string} isbn - The ISBN as a string.
 * @returns {boolean} `true` if the ISBN is invalid; `false` otherwise.
 */
export const isIsbnInvalid = (isbn: string) => !isIsbnValid(isbn);

/**
 * Determines the region name associated with an ISBN based on its prefix. Region names are all in Polish.
 *
 * @param {string} isbn - The ISBN as a string.
 * @returns {string | null} The region name as a string, or `null` if not recognized.
 */
export function getRegionNameFromIsbn(isbn: string): string | null {
  if (isIsbnInvalid(isbn)) return null;

  isbn = toDigits(isbn);

  const start = toDigits(isbn).length === 10 ? 0 : 3;

  for (let i = 5; i >= 1; i--) {
    const prefix = isbn.slice(start, start + i);

    if (ISBN_REGION_CODES[prefix] !== undefined) {
      return ISBN_REGION_CODES[prefix];
    }
  }
  return null;
}
