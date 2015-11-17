import expect from 'expect';
import abstractNumberInput from '../index';

const TAB = 9;
const ENTER = 13;
const MINUS = 45;
const PLUS = 43;

function digit(zeroToNine) {
  return 48 + zeroToNine;
}

const abstractNumInput = abstractNumberInput(new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
}));


describe('handleKeyPress', () => {
  function position(idx) {
    return {start: idx, end: idx};
  }

  describe('stopPropagation and preventDefault', () => {
    it('both falsy for ENTER and TAB', () => {
      [ENTER, TAB].forEach(charCode => {
        const {stopPropagation, preventDefault} =
            abstractNumInput.handleKeyPress({ charCode, selection: position(2), value: '1.34'});
        expect(stopPropagation).toBeFalsy();
        expect(preventDefault).toBeFalsy();
      });
    });

    it('both true for MINUS, PLUS, and digit', () => {
      [MINUS, PLUS, digit(2)].forEach(charCode => {
        const {stopPropagation, preventDefault} =
            abstractNumInput.handleKeyPress({ charCode, selection: position(2), value: '1.34'});
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
      });
    });
  });
  describe('MINUS', () => {
    const charCode = MINUS;

    it('returns negative when input is positive', () => {
      const {value, selection} =
          abstractNumInput.handleKeyPress({ charCode, selection: position(2), value: '1.34'});

      expect(value).toBe(-1.34);
      expect(selection).toEqual(position(3));
    });

    it('returns positive when input is negative', () => {
      const pos = position(3);

      const {value, selection} =
          abstractNumInput.handleKeyPress({charCode, selection: pos, value: '-1.34'});

      expect(value).toBe(1.34);
      expect(selection).toEqual(position(2));
    });
  });

  describe('PLUS', () => {
    const charCode = PLUS;

    it('returns positive when input is positive', () => {
      const {value} =
          abstractNumInput.handleKeyPress({charCode, selection: position(0), value: '1.34'});

      expect(value).toBe(1.34);
    });

    it('returns positive when input is negative', () => {
      const {value} =
          abstractNumInput.handleKeyPress({charCode, selection: position(0), value: '-1.34'});

      expect(value).toBe(1.34);
    });
  });

  it('handles a digit', () => {
    const {value} =
        abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(0), value: '-1.34'});
    expect(value).toBe(-21.34);
  });

  it('handles a fraction digit', () => {
    const {value} =
        abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(2), value: '1.34'});
    expect(value).toBe(12.34);
  });

  it('handles a fraction digit breaks a thousand', () => {
    const {value, selection} =
        abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(5), value: '163.45'});
    expect(value).toBe(1634.25);
    expect(selection).toEqual(position(7));
  });

  it('handles a fraction digit 2', () => {
    const {value, selection} =
        abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(4), value: '1.63'});
    expect(value).toBe(16.32);
    expect(selection).toEqual(position(5));
  });

  describe('range selection', () => {
    it('handles a digit', () => {
      const {value, selection} =
          abstractNumInput.handleKeyPress({charCode: digit(2), selection: {start: 0, end: 4}, value: '1.34'});
      expect(value).toBe(0.02);
      expect(selection).toEqual(position(4));
    });
  });

  describe('maxlength', () => {
    it('enough room', () => {
      const {value} =
          abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(0), value: '1.34',
            maxlength: 6}); // Leave extra character for a negative.

      expect(value).toBe(21.34);
    });

    it('not enough room if you leave room for a negative sign', () => {
      const {value} =
          abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(0), value: '1.34',
            maxlength: 5});

      expect(value).toBe(1.34);
    });

    it('not enough room but leading zero', () => {
      const {value} =
          abstractNumInput.handleKeyPress({charCode: digit(2), selection: position(2),
            value: '-0.34', maxlength: 5});

      expect(value).toBe(-2.34);
    });

    it('not enough room but selection has digit', () => {
      const mySelection = {start: 1, end: 2};
      const {value} =
          abstractNumInput.handleKeyPress({charCode: digit(2), selection: mySelection, value: '-1.34',
            maxlength: 5});

      expect(value).toBe(-2.34);
    });
  });
});
