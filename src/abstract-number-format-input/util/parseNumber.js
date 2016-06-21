import escapeRegExp from './escapeRegExp';
import invariant from 'invariant';
import isFinite from 'lodash.isfinite';

function assertZeroOrOneDecimalChar(str, decimalChar) {
  if (!decimalChar) return;
  const decimalRegExp = new RegExp(escapeRegExp(decimalChar), 'g');
  const decimalMatches = str.match(decimalRegExp);
  const matchCount = decimalMatches ? decimalMatches.length : 0;
  invariant(matchCount <= 1, `Expected 0 or 1 decimal matches but got ${matchCount}.
      Decimal: '${decimalChar}' String: '${str}'`);
}

export default function parseNumber(formattedNumber, decimalChar) {
  invariant(formattedNumber, `Unable to parse: ${JSON.stringify(formattedNumber)}`);
  assertZeroOrOneDecimalChar(formattedNumber, decimalChar);

  const numberStr = formattedNumber.split(decimalChar)
      .map(x => x.replace(/[^-\d]/g, '')) // Remove all non-essential characters.
      .join('.'); // Join with decimal point.
  invariant(numberStr.lastIndexOf('-') <= 0, `Misplaced minus sign in '${numberStr}'`);

  const number = parseFloat(numberStr);
  invariant(isFinite(number), `parseFloat was unable to parse '${numberStr}'`);

  return number;
}
