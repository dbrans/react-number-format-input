import spliceString from './spliceString';
import parseNumber from './parseNumber';
import escapeRegExp from './escapeRegExp';
import indexOfLastDigit from './indexOfLastDigit';

function justDigits(str) {
  return str.replace(/\D/g, '');
}

export default function formattedNumberReducer(numberFormat) {
  const {maximumFractionDigits, style} = numberFormat.resolvedOptions();
  const allowsFractionDigits = maximumFractionDigits > 0;
  const isPercent = style === 'percent';
  const decimalChar = allowsFractionDigits ? numberFormat.format(0.1).match(/\d(\D+)\d/)[1] : null;

  const fractionRegExp = allowsFractionDigits ? new RegExp(escapeRegExp(decimalChar) + '\\d*\\b') : null;
  const fractionPlaceholder = allowsFractionDigits ? (decimalChar + Array(maximumFractionDigits + 1).join('0')) : null;

  function isNegative(formattedNumber) {
    return !!formattedNumber.match(/-/);
  }

  function parse(formattedNumber) {
    const number = parseNumber(formattedNumber, decimalChar);
    return isPercent ? number / 100 : number;
  }

  function addTrailingZeros(formattedNumber) {
    if (!allowsFractionDigits) return formattedNumber;

    const match = fractionRegExp.exec(formattedNumber);
    const existingFractionLength = match ? match[0].length : 0;
    const placeholder = fractionPlaceholder.slice(existingFractionLength);
    return spliceString(formattedNumber, indexOfLastDigit(formattedNumber) + 1, 0, placeholder);
  }

  function format(number) {
    return addTrailingZeros(numberFormat.format(number));
  }

  function placeDecimalInDigits(digits) {
    if (!allowsFractionDigits) return digits;

    const extraDigits = digits.length - maximumFractionDigits;
    const leadingFractionZerosNeeded = Math.max(0, -extraDigits);
    const integerDigits = Math.max(0, extraDigits);
    const decimalAndLeadingZeros = fractionPlaceholder.slice(0, 1 + leadingFractionZerosNeeded);

    return spliceString(digits, integerDigits, 0, decimalAndLeadingZeros);
  }

  function fixupSplice(editedStr) {
    const _temp = justDigits(editedStr);
    const digits = _temp.length ? _temp : '0';
    const digitsWithDecimal = placeDecimalInDigits(digits);
    const sign = isNegative(editedStr) ? '-' : '';
    return format(parse(sign + digitsWithDecimal));
  }

  function splice(formattedNumber, position, deleteCount, insertDigits = '') {
    return fixupSplice(spliceString(formattedNumber, position, deleteCount, justDigits(insertDigits)));
  }

  function flipSign(formattedNumber) {
    return format(-parse(formattedNumber));
  }

  return { parse, format, flipSign, isNegative, splice };
}
