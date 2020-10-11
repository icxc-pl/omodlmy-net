const CopyWebPackPlugin = require('copy-webpack-plugin');
const dir = require('../dir');

const patterns = [
  {
    from: dir.static,
    to: dir.dist,
    globOptions: {
      ignore: ['.*']
    }
  }
];

module.exports = new CopyWebPackPlugin({ patterns });
