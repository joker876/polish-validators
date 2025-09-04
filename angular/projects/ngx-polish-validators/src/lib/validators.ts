import { ValidatorFn } from '@angular/forms';
import {
  isCreditCardNumberValid,
  isDoctorNumberValid,
  isIbanValid,
  isIdCardNumberValid,
  isImeiValid,
  isIsbnValid,
  isNipValid,
  isPeselValid,
  isPostalCodeValid,
  isRegonValid
} from 'polish-validators';

export class PolishValidators {
  static creditCard: ValidatorFn = control =>
    !control.value || isCreditCardNumberValid(control.value) ? {} : { creditCardNumber: true };

  static doctorNumber: ValidatorFn = control =>
    !control.value || isDoctorNumberValid(control.value) ? {} : { doctorNumber: true };

  static iban(options: {
    allowedCountryCodes?: string[];
    requireCountryCode?: boolean;
  }): ValidatorFn {
    return control => {
      const v = control.value;
      if (!v) return {};
      if (options.requireCountryCode && !/^[a-z]{2}/i.test(v)) {
        return { ibanCountryCodeRequired: true };
      }
      if (!isIbanValid(v)) return { iban: true };

      if (options.allowedCountryCodes) {
        const countryCodeRaw = v.match(/^([a-z]{2})/i)[1] ?? '';
        const countryCode = countryCodeRaw || 'PL';
        if (!options.allowedCountryCodes.includes(countryCode)) {
          return { ibanCountryCodeNotAllowed: countryCodeRaw };
        }
      }

      return {};
    };
  }

  static idCard: ValidatorFn = control =>
    !control.value || isIdCardNumberValid(control.value) ? {} : { idCardNumber: true };

  static imei: ValidatorFn = control => (!control.value || isImeiValid(control.value) ? {} : { imei: true });

  static isbn: ValidatorFn = control => (!control.value || isIsbnValid(control.value) ? {} : { isbn: true });

  static nip: ValidatorFn = control => (!control.value || isNipValid(control.value) ? {} : { nip: true });

  static pesel: ValidatorFn = control => (!control.value || isPeselValid(control.value) ? {} : { pesel: true });

  static postalCode: ValidatorFn = control =>
    !control.value || isPostalCodeValid(control.value) ? {} : { postalCode: true };

  static regon: ValidatorFn = control => (!control.value || isRegonValid(control.value) ? {} : { regon: true });
}
