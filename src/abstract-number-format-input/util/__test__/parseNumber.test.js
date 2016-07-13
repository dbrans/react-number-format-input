import expect from 'expect';
import parseNumber from './../parseNumber';

const defaultDecimalChar = '.';

describe('parse', () => {
  it('throws for empty values', () => {
    ['', null, undefined].forEach(val => {
      expect(parseNumber.bind(null, val, defaultDecimalChar)).toThrow();
    });
  });

  it('handles commas', () => {
    ['110,000', '110,00,0', '110,00,0', '110,000'].forEach(val => {
      expect(parseNumber(val, defaultDecimalChar)).toBe(110000);
    });
  });

  it('handles decimals', () => {
    const expected = [110000.1, 0.055, 0.1, 16.6];
    ['110,000.1', '.055', '0.1', '16.6'].forEach(val => {
      expect(parseNumber(val, defaultDecimalChar)).toEqual(expected.shift());
    });
  });

  it('handles leading and trailing zeros', () => {
    const expected = [110000.1, 0.055, 0.01, 16.6];
    ['0110,000.10', '0.0550', '0.010', '016.60'].forEach(val => {
      expect(parseNumber(val, defaultDecimalChar)).toEqual(expected.shift());
    });
  });

  it('handles prefix and suffix', () => {
    const expected = [110000.1, 0.055, 0.01, 16.6];
    ['$0110,000.10 USD', '$0.0550 USD', '$0.010 USD', '$016.60 USD'].forEach(val => {
      expect(parseNumber(val, defaultDecimalChar)).toEqual(expected.shift());
    });
  });

  it('handles other decimal characters', () => {
    const expected = [110000.1, 0.055, 0.01, 16.6];
    ['0110.000,10', '0,0550', '0,010', '016,60'].forEach(val => {
      expect(parseNumber(val, ',')).toEqual(expected.shift());
    });
  });

  it('handles percent', () => {
    expect(parseNumber('10.0%', '.')).toBe(10);
  });

  it('throws when magnitude is unparsable', () => {
    // TODO: '2booya2' should throw.
    ['-', '.', '-.', '3-3', '3.3-'].forEach(val => {
      expect(parseNumber.bind(null, val, defaultDecimalChar)).toThrow();
    });
  });

  it('reads sign with and without prefix', () => {
    const expected = [-110000.1, -7.055, -2, -16.6];
    ['-110,000.10', '-$7.0550USD', '-$02 USD', '$-016.60'].forEach(val => {
      expect(parseNumber(val, defaultDecimalChar)).toEqual(expected.shift());
    });
  });
});
