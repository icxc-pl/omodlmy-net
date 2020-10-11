const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');
const dir = require('../dir');
const $package = require('../../package.json');

module.exports = new FaviconsWebpackPlugin({
  logo: path.join(dir.img, 'logo.png'),
  cache: true,
  prefix: 'assets/webapp/',
  inject: true,
  favicons: {
    appName: 'omodlmy.net',
    appDescription: 'Twoja modlitwa się liczy',
    developerName: 'ICXC.pl',
    developerURL: 'http://icxc.pl',
    lang: 'pl-PL',
    background: '#551adb',
    theme_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    version: $package.version
  }
});
