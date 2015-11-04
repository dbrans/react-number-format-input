'use strict';

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'NumberFormatInput',
    libraryTarget: 'umd'
  },
  externals: {
    react: true
  },
  resolve: {
    extensions: ['', '.js']
  }
};
