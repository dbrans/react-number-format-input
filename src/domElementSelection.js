export function getSelection(elem) {
  return { start: elem.selectionStart, end: elem.selectionEnd };
}

export function setSelection(elem, {start, end = start}) {
  elem.setSelectionRange(start, end);
}
