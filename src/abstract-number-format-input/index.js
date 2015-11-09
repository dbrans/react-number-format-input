import spliceString from './util/spliceString';
import parseNumber from './util/parseNumber';
import escapeRegExp from './util/escapeRegExp';
import indexOfLastDigit from './util/indexOfLastDigit';
import invariant from 'invariant';
import nextPosition from './nextPosition';

function indexOfDigit(str, start, direction) {
  let pos = start;
  while (str.charAt(pos).match(/\D/)) pos += direction;
  return pos;
}

const BACKSPACE = 8;
const DELETE = 46;

function justDigits(str) {
  return str.replace(/\D/g, '');
}

function isNegative(formattedNumber) {
  return !!formattedNumber.match(/-/);
}

export default function formattedNumberReducer(numberFormat) {
  const {maximumFractionDigits, style} = numberFormat.resolvedOptions();
  const allowsFractionDigits = maximumFractionDigits > 0;
  const isPercent = style === 'percent';
  const decimalChar = allowsFractionDigits ? numberFormat.format(0.1).match(/\d(\D+)\d/)[1] : null;

  const fractionRegExp = allowsFractionDigits ? new RegExp(escapeRegExp(decimalChar) + '\\d*\\b') : null;
  const fractionPlaceholder = allowsFractionDigits ? (decimalChar + Array(maximumFractionDigits + 1).join('0')) : null;

  function parse(formattedNumber) {
    if (formattedNumber === '') return null;
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
    if (number === null) return '';
    invariant(Number.isFinite(number), `Illegal number value: ${JSON.stringify(number)}`);
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
    if (!_temp.length) return null;
    const digits = _temp.length ? _temp : '0';
    const digitsWithDecimal = placeDecimalInDigits(digits);
    const sign = isNegative(editedStr) ? '-' : '';
    return parse(sign + digitsWithDecimal);
  }

  function splice(formattedNumber, position, deleteCount, insertDigits = '') {
    return fixupSplice(spliceString(formattedNumber, position, deleteCount, justDigits(insertDigits)));
  }

  function flipSign(formattedNumber) {
    return -parse(formattedNumber);
  }

  function handleKeyPress({charCode, selection, value, maxlength}) {
    const {start, end} = selection;
    const char = String.fromCharCode(charCode);
    let nextValue = parse(value);

    if (char === '-') nextValue = flipSign(value);
    else if (char === '+') nextValue = isNegative(value) ? flipSign(value) : parse(value);
    else if (char.match(/\d/)) nextValue = splice(value, start, end - start, char);

    // Revert if nextValue does not fit in input's maxlength.
    if (format(nextValue).length > maxlength) nextValue = parse(value);

    const position = nextPosition({start, end}, value, format(nextValue));

    return {selection: {start: position, end: position}, value: nextValue};
  }

  function handleKeyDown({charCode, selection, value}) {
    if (charCode !== DELETE && charCode !== BACKSPACE) return {selection: null, value: parse(value)};
    let {start, end} = selection;
    if (start === end) {
      // No significant digits, when user presses DELETE or backspace we clear the input.
      if (parse(value) === 0) return {selection: {start: 0, end: 0}, value: null};
      // No selection: backspace and delete behave differently.
      const pos =
          charCode === DELETE ? indexOfDigit(value, start, 1) : indexOfDigit(value, start - 1, -1);
      if (pos >= 0 && pos < value.length) [start, end] = [pos, pos + 1];
    }

    const nextValue = splice(value, start, end - start);
    const position = nextPosition({start, end}, value, format(nextValue));

    return {
      selection: {start: position, end: position},
      value: nextValue,
    };
  }


  return { parse, format, splice, flipSign, isNegative, handleKeyDown, handleKeyPress };
}
