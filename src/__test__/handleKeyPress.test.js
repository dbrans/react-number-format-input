import expect from 'expect';
import handleKeyPress from './../handleKeyPress';

const MINUS = 45;
const PLUS = 43;
function code(digit) {
  return 48 + digit;
}

const numberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

describe('handleKeyPress', () => {
  function position(idx) {
    return {start: idx, end: idx};
  }

  describe('minus key', () => {
    const charCode = MINUS;

    it('returns negative when input is positive', () => {
      const {value, selection} =
          handleKeyPress({ charCode, selection: position(2), value: '1.34', numberFormat});

      expect(value).toBe('-1.34');
      expect(selection).toEqual(position(3));
    });

    it('returns positive when input is negative', () => {
      const pos = position(3);

      const {value, selection} =
          handleKeyPress({charCode, selection: pos, value: '-1.34', numberFormat});

      expect(value).toBe('1.34');
      expect(selection).toEqual(position(2));
    });
  });

  describe('plus key', () => {
    const charCode = PLUS;

    it('returns positive when input is positive', () => {
      const {value} =
          handleKeyPress({charCode, selection: position(0), value: '1.34', numberFormat});

      expect(value).toBe('1.34');
    });

    it('returns positive when input is negative', () => {
      const {value} =
          handleKeyPress({charCode, selection: position(0), value: '-1.34', numberFormat});

      expect(value).toBe('1.34');
    });
  });

  it('handles a digit', () => {
    const {value} =
        handleKeyPress({charCode: code(2), selection: position(0), value: '-1.34',
          numberFormat});
    expect(value).toBe('-21.34');
  });

  it('handles a fraction digit', () => {
    const {value} =
        handleKeyPress({charCode: code(2), selection: position(2), value: '1.34',
          numberFormat});
    expect(value).toBe('12.34');
  });

  it('handles a fraction digit breaks a thousand', () => {
    const {value, selection} =
        handleKeyPress({charCode: code(2), selection: position(5), value: '163.45',
          numberFormat});
    expect(value).toBe('1,634.25');
    expect(selection).toEqual(position(7));
  });

  it('handles a fraction digit 2', () => {
    const {value, selection} =
        handleKeyPress({charCode: code(2), selection: position(4), value: '1.63',
          numberFormat});
    expect(value).toBe('16.32');
    expect(selection).toEqual(position(5));
  });

  describe('range selection', () => {
    it('handles a digit', () => {
      const {value, selection} =
          handleKeyPress({charCode: code(2), selection: {start: 0, end: 4}, value: '1.34',
            numberFormat});
      expect(value).toBe('0.02');
      expect(selection).toEqual(position(4));
    });
  });

  describe('maxlength', () => {
    it('enough room', () => {
      const {value} =
          handleKeyPress({charCode: code(2), selection: position(0), value: '1.34',
            maxlength: 5, numberFormat});

      expect(value).toBe('21.34');
    });

    it('not enough room', () => {
      const {value} =
          handleKeyPress({charCode: code(2), selection: position(0), value: '1.34',
            maxlength: 4, numberFormat});

      expect(value).toBe('1.34');
    });

    it('not enough room but leading zero', () => {
      const {value} =
          handleKeyPress({charCode: code(2), selection: position(1),
            value: '0.34', maxlength: 4,
            numberFormat});

      expect(value).toBe('2.34');
    });

    it('not enough room but selection has digit', () => {
      const mySelection = {start: 0, end: 1};
      const {value} =
          handleKeyPress({charCode: code(2), selection: mySelection, value: '1.34',
            maxlength: 4, numberFormat});

      expect(value).toBe('2.34');
    });
  });
});
