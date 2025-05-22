# Polish Validators

This npm package provides a series of validation functions to check the validity of common Polish identifiers, international standards, and other regulated numbers. Each function is designed to handle specific formatting rules and checksum requirements, making it suitable for validating a range of national and international numbers.

**Note:** All functions that check validity also have their counterparts that check invalidity. For example, both `isPeselValid` and `isPeselInvalid` are available.

## Highlights

- Supports TypeScript!
- Includes full JSDoc documentation
- Includes 100+ unit tests

## Installation

```
npm install polish-validators --save
```

## Usage

```typescript
import * from 'polish-validators';
// or
import { /* function names here */ } from 'polish-validators';
```

## PESEL

### isPeselValid

```typescript
isPeselValid(pesel: string): boolean
```

Validates a PESEL (Polish national identification number) string.

This function validates the control number and ensures the birthdate is also valid.

**Note:** This validator isn't perfect. Some invalid numbers might still return true. For example, people born before the year 1931 might accidentally swap their birthyear and birthday and the function will still pass. 1st, 5th, and 9th or 2nd, 6th, and 10th numbers may also be swapped while still passing. There is nothing that can really be done about that, other than validating against a database of PESEL numbers.

- **Parameters**:
  - `pesel`: The 11-digit PESEL number as a string.
- **Returns**: `true` if the PESEL is valid; `false` otherwise.

### getBirthdateFromPesel

```typescript
getBirthdateFromPesel(pesel: string): Date
```

Extracts the birthdate from a valid PESEL number.

- **Parameters**:
  - `pesel`: The 11-digit PESEL number as a string.
- **Returns**: A `Date` object containing the year, month, and day extracted from the PESEL. Throws an error if an invalid PESEL is given.

### extractSexFromPesel

```typescript
extractSexFromPesel(pesel: string): PeselSex
```

Extracts the sex from a valid PESEL number.

- **Parameters**:
  - `pesel`: The 11-digit PESEL number as a string.
- **Returns**: Either `"male"` or `"female"`. Throws an error if an invalid PESEL is given.

## NIP

### isNipValid

```typescript
isNipValid(nip: string): boolean
```

Validates a NIP (Polish tax identification number) string. This function checks the format of the NIP, ensuring it has either 10 or 13 digits, is not all zeros, and meets a specific checksum requirement. Any dashes or whitespace are ignored.

- **Parameters**:
  - `nip`: The NIP number as a string, which may include dashes or whitespace.
- **Returns**: `true` if the NIP is valid; `false` otherwise.

### formatNip

```typescript
formatNip(nip: string, format: NipFormat = NipFormat.Format3223): string
```

Formats a valid NIP into the specified format.

- **Parameters**:
  - `nip`: The NIP as a string, which may include dashes or whitespace.
  - `format`: The format to be applied. Can be either `"3-2-2-3"` or `"3-3-2-2"`. Optional, defaults to `"3-2-2-3"`.
- **Returns**: the NIP formatted according to the given format, or `"Nieprawidłowy NIP"` if the NIP is invalid.

## REGON

### isRegonValid

```typescript
isRegonValid(regon: string): boolean
```

Validates a REGON (Polish National Business Registry Number) string. The function checks for 9- or 14-digit formats and calculates a checksum according to REGON requirements. Any dashes or whitespace are ignored.

- **Parameters**:
  - `regon`: The REGON number as a string, which may include dashes or whitespace.
- **Returns**: `true` if the REGON is valid; `false` otherwise.

## Postal Code (Kod Pocztowy)

### isPostalCodeValid

```typescript
isPostalCodeValid(code: string): boolean
```

Validates a Polish postal code format. This function checks that the code follows the format `XX-XXX`, where each `X` is a digit. The dash in the format is optional, but putting a dash in the wrong place will result in the code being invalid.

This function does not validate whether a code actually exists. There are over 40,000 unique postal codes in Poland, and they do not follow a specific pattern.

- **Parameters**:
  - `code`: The postal code as a string.
- **Returns**: `true` if the postal code format is valid; `false` otherwise.

## ID Card Number (Seria i Numer Dowodu Osobistego)

### isIdCardNumberValid

```typescript
isIdCardNumberValid(number: string): boolean
```

Validates a Polish ID card number. The function verifies that the number matches a specific pattern (`AAA XXXXXX` where each `A` is any letter a-z and each `X` is any digit) and validates the control digit based on a checksum calculation. Any dashes or whitespace are ignored.

- **Parameters**:
  - `number`: The ID card number as a string.
- **Returns**: `true` if the ID card number is valid; `false` otherwise.

## Doctor Number (Numer PWK Lekarza)

### isDoctorNumberValid

```typescript
isDoctorNumberValid(number: string): boolean
```

Validates a doctor's identifier in Poland, ensuring it has 7 digits and passes a checksum validation. Any characters other than digits will result in the identifier being invalid.

- **Parameters**:
  - `number`: The doctor's identification number as a string.
- **Returns**: `true` if the doctor's number is valid; `false` otherwise.

## Credit Card Number (Numer Karty Płatniczej)

### isCreditCardNumberValid

```typescript
isCreditCardNumberValid(number: string): boolean
```

Validates a credit card number using the Luhn algorithm. The function requires a 16-digit credit card number. Any dashes or whitespace are ignored.

- **Parameters**:
  - `number`: The 16-digit credit card number as a string.
- **Returns**: `true` if the credit card number is valid; `false` otherwise.

### getCreditCardType

```typescript
getCreditCardType(number: string): CreditCardType | null
```

Determines the type of credit card based on the first digit of the card number.

- **Parameters**:
  - `number`: The credit card number as a string.
- **Returns**: The credit card type (`CreditCardType`), or `null` if the type cannot be determined.

#### CreditCardType

The `CreditCardType` is a custom object-based enum, defined as:

```typescript
export const CreditCardType = {
  Airline: 'airline',
  ClubCard: 'clubcard',
  Visa: 'Visa',
  MasterCard: 'mastercard',
  Finances: 'finances',
  Fuel: 'fuel',
  Telecommunication: 'telecommunication',
  Other: 'other',
} as const;
export type CreditCardType = (typeof CreditCardType)[keyof typeof CreditCardType];
```

## IBAN

### isIbanValid

```typescript
isIbanValid(iban: string): boolean
```

Validates an International Bank Account Number (IBAN). The function checks for proper length, format, and passes the IBAN checksum requirements. In the case of IBANs starting with `PL` (or with no country code), the 3rd-5th digits are validated against a list of Polish banks. Any whitespace is ignored, but other characters will result in the IBAN being invalid.

- **Parameters**:
  - `iban`: The IBAN number as a string, with or without spaces.
- **Returns**: `true` if the IBAN is valid; `false` otherwise.

### getCountryIbanDataFromIban

```typescript
getCountryIbanDataFromIban(iban: string): { country: string; length: number } | null
```

Extracts country-specific information from the IBAN.

- **Parameters**:
  - `iban`: The IBAN number as a string.
- **Returns**: An object containing the country name and IBAN length for the given IBAN, or `null` if not valid.

### getBankNameFromIban

```typescript
getBankNameFromIban(iban: string): string | null
```

Fetches the bank name based on the IBAN, specifically for Polish IBANs. If a non-Polish IBAN is supplied, it will always return `null`. Bank names are all in Polish.

- **Parameters**:
  - `iban`: The IBAN number as a string.
- **Returns**: The bank name as a string, or `null` if not available.

## IMEI

### isImeiValid

```typescript
isImeiValid(imei: string): boolean
```

Validates an IMEI (International Mobile Equipment Identity) number, using the Luhn algorithm. Checks that the IMEI is 15 digits. Any dashes, slashes, or whitespace are ignored.

- **Parameters**:
  - `imei`: The 15-digit IMEI number as a string.
- **Returns**: `true` if the IMEI is valid; `false` otherwise.

## ISBN

### isIsbnValid

```typescript
isIsbnValid(isbn: string): boolean
```

Validates an ISBN (International Standard Book Number), supporting both ISBN-10 and ISBN-13 formats. Ensures that the ISBN has the correct format and checksum. Any dashes or whitespace are ignored.

- **Parameters**:
  - `isbn`: The ISBN as a string.
- **Returns**: `true` if the ISBN is valid; `false` otherwise.

### getRegionNameFromIsbn

```typescript
getRegionNameFromIsbn(isbn: string): string | null
```

Determines the region name associated with an ISBN based on its prefix. Region names are all in Polish.

- **Parameters**:
  - `isbn`: The ISBN as a string.
- **Returns**: The region name as a string, or `null` if not recognized.
