import React from 'react';
import { render } from 'react-dom';

function runMyApp() {
  const App = require('./App');
  render(<App/>, document.getElementById('root'));
}

if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
  ], function requireIntl(require) {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    runMyApp();
  });
} else {
  runMyApp();
}
