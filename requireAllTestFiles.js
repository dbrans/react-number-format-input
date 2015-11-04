function requireAllTestFiles() {
  var context = require.context('./src', true, /\.test\.js$/);
  context.keys().forEach(context);
}

// Source: https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack
if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
}

requireAllTestFiles();

