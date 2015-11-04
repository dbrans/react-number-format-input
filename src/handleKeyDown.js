import formattedNumber from './util/formattedNumber';
import nextPosition from './nextPosition';

// Keycodes we care about. http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
const BACKSPACE = 8;
const DELETE = 46;

function indexOfDigit(str, start, direction) {
  let pos = start;
  while (str.charAt(pos).match(/\D/)) pos += direction;
  return pos;
}

export default function handleKeyDown({charCode, selection, value, numberFormat}) {
  if (charCode !== DELETE && charCode !== BACKSPACE) return {selection: null, value};
  const {splice} = formattedNumber(numberFormat);

  let {start, end} = selection;
  if (start === end) {
    // No selection: backspace and delete behave differently.
    const pos =
        charCode === DELETE ? indexOfDigit(value, start, 1) : indexOfDigit(value, start - 1, -1);
    if (pos >= 0 && pos < value.length) [start, end] = [pos, pos + 1];
  }

  const nextValue = splice(value, start, end - start);
  const position = nextPosition({start, end}, value, nextValue);

  return {
    selection: {start: position, end: position},
    value: nextValue,
  };
}
