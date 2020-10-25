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
      host: '0.0.0.0',
      port: 8000,
      https: {
        key: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.key')),
        cert: fs.readFileSync(path.join(certDir, 'local.omodlmy.net.cert'))
      },
      proxy: [{
        context: ['/api', '/captcha'],
        target: 'https://local.omodlmy.net:8001',
        secure: false
      }],
      disableHostCheck: true,
      //contentBase: common.dir.dist,
      compress: false
    };
  }

}

module.exports = WatchConfig;
