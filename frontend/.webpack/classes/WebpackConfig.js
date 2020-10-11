'use strict';

const path = require('path');
const dir = require('../dir');

class WebpackConfig {

  constructor () {
    this._entry = {
      main: path.join(dir.src, 'main.js'),
      'service-worker': path.join(dir.src, 'service-worker/index.js')
    };
    this._output = {
      path: dir.dist,
      filename: '[name].js',
      chunkFilename: '[name].[hash].chunk.js',
      publicPath: '/'
    };

    this._stats = true;

    this._resolve = {
      modules: [
        'node_modules'
      ],

      extensions: ['.js', '.vue', '.json'],

      alias: {
        'Root': dir.root,
        'Src': dir.src,

        'Fonts': path.resolve(dir.assets, 'fonts'),
        'I18n': path.resolve(dir.assets, 'i18n'),
        'Img': dir.img,

        'Components': path.resolve(dir.src, 'components'),
        'Lib': path.resolve(dir.src, 'lib'),
        'Static': dir.static,
        'Stylesheets': path.resolve(dir.src, 'stylesheets'),

        'vue': 'vue/dist/vue.min'
      },

      symlinks: false
    };

    this._resolveLoader = {
      modules: [
        'node_modules'
      ]
    };

    this._module = {
      rules: require('../rules')
    };

    this._externals = ['fs', 'child_process'];

    this._plugins = require('../plugins');
  }

  export () {
    const config = {};
    for (const key in this) {
      if (key[0] === '_' && key[1] !== '_') {
        config[key.substr(1)] = this[key];
      }
    }
    return config;
  }

}

module.exports = WebpackConfig;
