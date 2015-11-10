export default [
  {
    description: 'Standard number format with two decimals',
    numberFormat: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, }),
  },
  {
    description: 'German uses comma as decimal separator and period for thousands',
    numberFormat: new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2, }),
  },
  {
    description: 'Currency USD',
    numberFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  },
  {
    description: 'Currency Euro',
    numberFormat: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  },
  {
    description: 'Japanese yen doesn\'t use a minor unit',
    numberFormat: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }),
    defaultValue: '-1234',
  },
  {
    description: 'Percent',
    numberFormat: new Intl.NumberFormat('en-US', { style: 'percent'}),
    defaultValue: 0.22,
  },
  {
    description: 'An empty input has value of null',
    numberFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    defaultValue: null,
  },
];
