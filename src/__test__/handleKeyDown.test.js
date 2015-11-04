import expect from 'expect';
import handleKeyDown from '../handleKeyDown';

const DELETE = 46;
const BACKSPACE = 8;

const numberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

describe('handleKeyDown', () => {
  function position(idx) {
    return {start: idx, end: idx};
  }

  describe('point selection', () => {
    it('handles BACKSPACE at start', () => {
      const {value} = handleKeyDown({
        charCode: BACKSPACE,
        selection: position(0),
        value: '12.23',
        numberFormat,
      });

      expect(value).toBe('12.23');
    });

    describe('BACKSPACE', () => {
      it('handles BACKSPACE across a comma', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(2),
          value: '1,234.00',
          numberFormat,
        });

        expect(value).toBe('234.00');
        expect(selection).toEqual(position(0));
      });

      it('handles BACKSPACE across a decimal', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(2),
          value: '14.23',
          numberFormat,
        });

        expect(value).toBe('1.23');
        expect(selection).toEqual(position(1));
      });

      it('handles BACKSPACE across a decimal with single integer digit', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(2),
          value: '1.23',
          numberFormat,
        });

        expect(value).toBe('0.23');
        expect(selection).toEqual(position(1));
      });

      it('handles BACKSPACE across a decimal with no integer digit', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(1),
          value: '0.23',
          numberFormat,
        });

        expect(value).toBe('0.23');
        expect(selection).toEqual(position(1));
      });

      it('handles BACKSPACE in the middle', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(2),
          value: '123.45',
          numberFormat,
        });

        expect(value).toBe('13.45');
        expect(selection).toEqual(position(1));
      });

      it('handles BACKSPACE at the end no fractions', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(4),
          value: '1.00',
          numberFormat,
        });

        expect(value).toBe('0.10');
        expect(selection).toEqual(position(4));
      });

      it('handles BACKSPACE at the end no integers', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(4),
          value: '1.23',
          numberFormat,
        });

        expect(value).toBe('0.12');
        expect(selection).toEqual(position(4));
      });

      it('handles BACKSPACE at the end but multiple integers', () => {
        const {value, selection} = handleKeyDown({
          charCode: BACKSPACE,
          selection: position(5),
          value: '14.23',
          numberFormat,
        });

        expect(value).toBe('1.42');
        expect(selection).toEqual(position(4));
      });
    });

    describe('DELETE', () => {
      it('handles DELETE at start with no integers', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(0),
          value: '0.45',
          numberFormat,
        });

        expect(value).toBe('0.45');
        expect(selection).toEqual(position(1));
      });

      it('handles DELETE in the middle', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(1),
          value: '123.45',
          numberFormat,
        });

        expect(value).toBe('13.45');
        expect(selection).toEqual(position(1));
      });

      it('handles DELETE at the end', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(5),
          value: '12.34',
          numberFormat,
        });

        expect(value).toBe('12.34');
        expect(selection).toEqual(position(5));
      });

      it('handles DELETE across a comma', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(1),
          value: '1,234.00',
          numberFormat,
        });

        expect(value).toBe('134.00');
        expect(selection).toEqual(position(1));
      });

      it('handles DELETE across a decimal', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(1),
          value: '1.23',
          numberFormat,
        });

        expect(value).toBe('0.13');
        expect(selection).toEqual(position(3));
      });

      it('handles DELETE across a decimal with no integers', () => {
        const {value, selection} = handleKeyDown({
          charCode: DELETE,
          selection: position(0),
          value: '0.23',
          numberFormat,
        });

        expect(value).toBe('0.23');
        expect(selection).toEqual(position(1));
      });
    });

    describe('range selection', () => {
      it('removes characters', () => {
        const {value} = handleKeyDown({
          charCode: DELETE,
          selection: {start: 1, end: 4},
          value: '12.34',
          numberFormat,
        });

        expect(value).toBe('0.14');
      });

      it('removes all characters', () => {
        const {value} = handleKeyDown({
          charCode: DELETE,
          selection: {start: 0, end: 5},
          value: '12.34',
          numberFormat,
        });

        expect(value).toBe('0.00');
      });

      it('keeps decimal', () => {
        const {value} = handleKeyDown({
          charCode: DELETE,
          selection: {start: 1, end: 3},
          value: '1.23',
          numberFormat,
        });

        expect(value).toBe('0.13');
      });

      it('keeps decimal 2', () => {
        const {value} = handleKeyDown({
          charCode: DELETE,
          selection: {start: 0, end: 3},
          value: '1.23',
          numberFormat,
        });

        expect(value).toBe('0.03');
      });
    });
  });
});
