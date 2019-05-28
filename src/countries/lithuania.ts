import { Country, Rules } from '../main';

export const lithuania: Country = {
  name: 'Lithuania',
  codes: ['LT', 'LTU', '440'],
  calcFn: (vat: string): boolean  => {

    function _extractDigit (vat: string, multiplierList: Array<number>, key: number): number {
      return Number(vat.charAt(key)) * multiplierList[key];
    }

    function _doubleCheckCalculation (vat: string, total: number, rules: Rules): number {
      if (total % 11 === 10) {
        total = 0;
        if (rules.multipliers && !Array.isArray(rules.multipliers)) {
          for (let i = 0; i < 8; i++) {
            total += _extractDigit(vat, rules.multipliers.short, i);
          }
        }
      }

      return total;
    }

    function extractDigit (vat: string, total: number) {
      for (let i = 0; i < 8; i++) {
        total += Number(vat.charAt(i)) * (i + 1);
      }
      return total;
    }

    function checkDigit (total: number): number {
      total = total % 11;
      if (total === 10) {
        total = 0;
      }

      return total;
    }

    function _check9DigitVat (vat: string, rules: Rules): boolean {
      // 9 character VAT numbers are for legal persons
      let total = 0;
      if (vat.length === 9) {
        // 8th character must be one
        if (!(/^\d{7}1/).test(vat)) return false;

        // Extract the next digit and multiply by the counter+1.
        total = extractDigit(vat, total);

        // Can have a double check digit calculation!
        total = _doubleCheckCalculation(vat, total, rules);

        // Establish check digit.
        total = checkDigit(total);

        // Compare it with the last character of the VAT number. If it's the same, then it's valid.
        const expect = Number(vat.slice(8, 9));
        return total === expect;
      }
      return false;
    }

    function extractDigit12 (vat: string, total: number, rules: Rules): number {
      if (rules.multipliers) {
        if (!Array.isArray(rules.multipliers)) {
          for (let k = 0; k < 11; k++) {
            total += _extractDigit(vat, rules.multipliers.med, k);
          }
        }
      }

      return total;
    }

    function _doubleCheckCalculation12 (vat: string, total: number, rules: Rules): number {
      if (rules.multipliers) {
        if (!Array.isArray(rules.multipliers)) {
          if (total % 11 === 10) {
            total = 0;
            for (let l = 0; l < 11; l++) {
              total += _extractDigit(vat, rules.multipliers.alt, l);
            }
          }
        }
      }

      return total;
    }

    function _check12DigitVat (vat: string, rules: Rules): boolean {
      let total = 0;
      if (Array.isArray(rules.multipliers)) return false;

      // 12 character VAT numbers are for temporarily registered taxpayers
      if (vat.length === 12) {
        if (!rules.check) return false;
        // 11th character must be one
        if (!(rules.check).test(vat)) return false;

        // Extract the next digit and multiply by the counter+1.
        total = extractDigit12(vat, total, rules);

        // Can have a double check digit calculation!
        total = _doubleCheckCalculation12(vat, total, rules);

        // Establish check digit.
        total = checkDigit(total);

        // Compare it with the last character of the VAT number. If it's the same, then it's valid.
        var expect = +vat.slice(11, 12);
        return total === expect;
      }

      return false;
    }

    return _check9DigitVat(vat, this.rules) || _check12DigitVat(vat, this.rules);
  },
  rules: {
    multipliers: {
      short: [3, 4, 5, 6, 7, 8, 9, 1],
      med: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
      alt: [3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4]
    },
    check: /^\d{10}1/,
    regex: [/^(LT)(\d{9}|\d{12})$/]
  }
};
