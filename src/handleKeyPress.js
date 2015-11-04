import formattedNumber from './util/formattedNumber';
import nextPosition from './nextPosition';

export default function handleKeyPress({charCode, selection, value, maxlength, numberFormat}) {
  const {splice, flipSign, isNegative} = formattedNumber(numberFormat);
  const {start, end} = selection;
  const char = String.fromCharCode(charCode);
  let nextValue = value;

  if (char === '-') nextValue = flipSign(value);
  else if (char === '+') nextValue = isNegative(value) ? flipSign(value) : value;
  else if (char.match(/\d/)) nextValue = splice(value, start, end - start, char);

  // Revert if nextValue does not fit in input's maxlength.
  if (nextValue.length > maxlength) nextValue = value;

  const position = nextPosition({start, end}, value, nextValue);

  return {selection: {start: position, end: position}, value: nextValue};
}
