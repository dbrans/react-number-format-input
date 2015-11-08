import expect from 'expect';
import spliceString from './../spliceString';

const str = '0123456789';
const inserted = 'abcde';

describe('spliceString', () => {
  it('deletes characters', () => {
    expect(spliceString(str, 0, 2)).toBe('23456789');
    expect(spliceString(str, 8, 20)).toBe('01234567');
    expect(spliceString(str, 8, 0)).toBe('0123456789');
  });

  it('inserts characters', () => {
    expect(spliceString(str, 0, 0, inserted)).toBe('abcde0123456789');
    expect(spliceString(str, 8, 0, inserted)).toBe('01234567abcde89');
  });

  it('inserts and deletes characters', () => {
    expect(spliceString(str, 0, 2, inserted)).toBe('abcde23456789');
    expect(spliceString(str, 8, 2, inserted)).toBe('01234567abcde');
    expect(spliceString(str, 5, 2, inserted)).toBe('01234abcde789');
    expect(spliceString(str, 0, str.length + 2, inserted)).toBe(inserted);
  });
});
