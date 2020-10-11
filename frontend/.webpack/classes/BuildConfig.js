const WebpackConfig = require('./WebpackConfig');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BannerPlugin } = require('webpack');
const dir = require('../dir');

class BuildConfig extends WebpackConfig {

  constructor () {
    super();
    this._mode = 'production';
    this._stats = 'errors-warnings';

    this._output = {
      path: dir.dist,
      filename: '[name].js',
      chunkFilename: '[name].[hash].chunk.js',
      publicPath: '/'
    };

    this._performance = {
      maxEntrypointSize: 512 * 1024,
      maxAssetSize: 512 * 1024
    };

    this._plugins.push(new CleanWebpackPlugin());
    this._plugins.push(
      new BannerPlugin(`Omódlmy.Net | (c) IXCX.pl | GNU AFFERO GENERAL PUBLIC LICENSE`)
    );
  }

}

module.exports = BuildConfig;
