import expect from 'expect';
import formattedNumberReducer from '../formattedNumber';

const simpleReducer = formattedNumberReducer(new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
}));

describe('splice', () => {
  describe('deletion', () => {
    it('works', () => {
      expect(simpleReducer.splice( '1.23', 0, 1)).toBe('0.23');
    });
    it('works 2', () => {
      expect(simpleReducer.splice( '1.23', 0, 3)).toBe('0.03');
    });
    it('works 3', () => {
      expect(simpleReducer.splice( '1.23', 0, 4)).toBe('0.00');
    });
    it('works 3b', () => {
      expect(simpleReducer.splice( '11.23', 0, 1)).toBe('1.23');
    });
    it('works 4', () => {
      expect(simpleReducer.splice( '-1.23', 1, 2)).toBe('-0.23');
    });
  });

  describe('insertion', () => {
    it('works', () => {
      expect(simpleReducer.splice( '1.23', 0, 0, '2')).toBe('21.23');
    });

    it('works', () => {
      expect(simpleReducer.splice( '1.23', 2, 0, '4')).toBe('14.23');
    });
    it('works', () => {
      expect(simpleReducer.splice( '1.23', 3, 0, '4')).toBe('12.43');
    });
    it('works', () => {
      expect(simpleReducer.splice( '4,561.23', 2, 0, '2')).toBe('42,561.23');
    });
  });
});

/*
TODO: Fix on phantomJS. Works on chrome.
describe('parse', () => {
  const percentReducer = formattedNumberReducer(new Intl.NumberFormat('en-US', {
    style: 'percent',
  }));

  describe('percent', () => {
    it('works', () => {
      expect(percentReducer.parse('10.0 %')).toBe(0.1)
    });
  });
});
*/

describe('flipSign', () => {
  it('works', () => {
    expect(simpleReducer.flipSign( '1.23')).toBe('-1.23');
  });
  it('works', () => {
    expect(simpleReducer.flipSign( '-1.23')).toBe('1.23');
  });
});

