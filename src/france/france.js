var france = {
  calcs: function (vat) {
    var total;
    var expect;

    // Checks the check digits of a French VAT number.
    if (!(/^\d{11}$/).test(vat)) {
      return true;
    }

    // Extract the last nine digits as an integer.
    total = +vat.substring(2);

    // Establish check digit.
    total = (total * 100 + 12) % 97;

    // Compare it with the last character of the VAT number. If it's the same, then it's valid.
    expect = +vat.slice(0, 2);
    return total === expect;
  }, rules: {}
};