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
    defaultValue: -123456,
  },
  {
    description: 'Percent',
    numberFormat: new Intl.NumberFormat('en-US', { style: 'percent'}),
    defaultValue: 0.22,
  },
  {
    description: 'allowNull=true',
    numberFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    allowNull: true,
    placeholder: 'Empty is null',
    defaultValue: null,
  },
];
