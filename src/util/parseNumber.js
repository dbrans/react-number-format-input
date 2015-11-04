import escapeRegExp from './escapeRegExp';

export function NumberFormatError(message) {
  this.name = 'NumberFormatError';
  this.message = 'NumberFormatError - ' + message;
  this.stack = (new Error()).stack;
}
NumberFormatError.prototype = new Error;

function assertZeroOrOneDecimalChar(str, decimalChar) {
  if (!decimalChar) return;
  const decimalRegExp = new RegExp(escapeRegExp(decimalChar), 'g');
  const decimalMatches = str.match(decimalRegExp);
  if (decimalMatches && decimalMatches.length > 1) {
    throw new NumberFormatError(
        `Expected 0 or 1 decimal matches but got ${decimalMatches.length}.
      Decimal: '${decimalChar}' String: '${str}'`);
  }
}

export default function parseNumber(formattedNumber, decimalChar) {
  if (!formattedNumber) throw new NumberFormatError(`Unable to parse: ${JSON.stringify(formattedNumber)}`);

  assertZeroOrOneDecimalChar(formattedNumber, decimalChar);

  const numberStr = formattedNumber.split(decimalChar)
      .map(x => x.replace(/[^-\d]/g, '')) // Remove all non-essential characters.
      .join('.'); // Join with decimal point.

  if (numberStr.lastIndexOf('-') > 0) throw new NumberFormatError(`Misplaced minus sign in '${numberStr}'`);

  const number = parseFloat(numberStr);

  if (isNaN(number)) throw new NumberFormatError(`parseFloat was unable to parse '${numberStr}'`);

  return number;
}
