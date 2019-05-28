import { Country } from '../main';

export const switzerland: Country = {
  name: 'Switzerland',
  codes: ['CH', 'CHE', '756'],
  calcFn: function (vat: string): boolean {
    if (!this.rules.multipliers) return false;
    if (!Array.isArray(this.rules.multipliers)) return false;
    let total = 0;
    for (let i = 0; i < 8; i++) {
      total += Number(vat.charAt(i)) * this.rules.multipliers[i];
    }

    // Establish check digit.s
    total = 11 - total % 11;
    if (total === 10) return false;
    if (total === 11) total = 0;

    // Check to see if the check digit given is correct, If not, we have an error with the VAT number
    const expect = Number(vat.substr(8, 1));
    return total === expect;
  },
  rules: {
    multipliers: [5, 4, 3, 2, 7, 6, 5, 4],
    regex: [/^(CHE)(\d{9})(MWST)?$/]
  }
};