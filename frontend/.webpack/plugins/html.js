const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dir = require('../dir');

const options = {
  template: path.join(dir.assets, 'index.html'),
  inject: true
};

if (process.env.NODE_ENV === 'production') {
  options.minify = {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  };
}

module.exports = new HtmlWebpackPlugin(options);
