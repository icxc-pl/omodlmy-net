const { DefinePlugin } = require('webpack');
const $package = require('../../package.json');

// https://github.com/webpack/webpack/issues/237#issuecomment-40398916
module.exports = new DefinePlugin({
  // Let's base64 it so there is no UI version in code in plain text
  __version: JSON.stringify($package.version)
});
