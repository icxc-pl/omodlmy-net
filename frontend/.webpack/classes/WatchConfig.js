const WebpackConfig = require('./WebpackConfig');

const fs = require('fs');
const path = require('path');
const certDir = path.resolve(__dirname, '../../../common/cert');

class WatchConfig extends WebpackConfig {

  constructor () {
    super();
    this._mode = 'development';
    this._devtool = 'cheap-source-map';

    this._devServer = {
      host: 'local.omodlmy.net',
      port: 8000,
      https: {
        key: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.key')),
        cert: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.cert'))
      },
      disableHostCheck: true,
      //contentBase: common.dir.dist,
      compress: false
    };
  }

}

module.exports = WatchConfig;
