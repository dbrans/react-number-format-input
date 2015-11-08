import expect from 'expect';
import formattedNumber from '../index';

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, });

const simpleFormatted = formattedNumber(numberFormat);
const simpleAllowNull = formattedNumber(numberFormat, true);

describe('format', () => {
  it('throws if value is null and allowNull is not set', () => {
    expect(simpleFormatted.format.bind(null, null)).toThrow('Invariant');
  });

  it('formats null as empty string if allowNull is set', () => {
    expect(simpleAllowNull.format(null)).toBe('');
  });

  it('Throws if value is not a finite number', () => {
    [false, 'booya', '123', '', undefined].forEach(value =>
            expect(simpleAllowNull.format.bind(null, value)).toThrow('Invariant')
    );
  });

  it('Formats a finite number to a string using numberFormat', () => {
    expect(simpleFormatted.format(3000.21)).toBe('3,000.21');
  });
});

describe('splice', () => {
  describe('deletion', () => {
    it('works', () => {
      expect(simpleFormatted.splice( '1.23', 0, 1)).toBe(0.23);
    });
    it('works 2', () => {
      expect(simpleFormatted.splice( '1.23', 0, 3)).toBe(0.03);
    });
    it('works 3', () => {
      expect(simpleFormatted.splice( '1.23', 0, 4)).toBe(0.00);
    });
    it('works 3b', () => {
      expect(simpleFormatted.splice( '11.23', 0, 1)).toBe(1.23);
    });
    it('works 4', () => {
      expect(simpleFormatted.splice( '-1.23', 1, 2)).toBe(-0.23);
    });
    it('converts no digits to 0 by default', () => {
      expect(simpleFormatted.splice( '$1.23', 1, 5)).toBe(0.00);
    });
    it('converts no digits to null if allowNull is true', () => {
      expect(simpleAllowNull.splice( '$1.23', 1, 5)).toBe(null);
    });
  });

  describe('insertion', () => {
    it('works', () => {
      expect(simpleFormatted.splice( '1.23', 0, 0, '2')).toBe(21.23);
    });

    it('works', () => {
      expect(simpleFormatted.splice( '1.23', 2, 0, '4')).toBe(14.23);
    });
    it('works', () => {
      expect(simpleFormatted.splice( '1.23', 3, 0, '4')).toBe(12.43);
    });
    it('works', () => {
      expect(simpleFormatted.splice( '4,561.23', 2, 0, '2')).toBe(42561.23);
    });
  });
});

/*
TODO: Fix on phantomJS. Works on chrome.
describe('parse', () => {
  const percentFormatted = abstractNumberInput(new Intl.NumberFormat('en-US', {
    style: 'percent',
  }));

  describe('percent', () => {
    it('works', () => {
      expect(percentFormatted.parse('10.0 %')).toBe(0.1)
    });
  });
});
*/

describe('flipSign', () => {
  it('works', () => {
    expect(simpleFormatted.flipSign( '1.23')).toBe(-1.23);
  });
  it('works', () => {
    expect(simpleFormatted.flipSign( '-1.23')).toBe(1.23);
  });
});

