if (process.env.API_URL == null) {
  process.env.API_URL = 'https://local.omodlmy.net:8001';
}

const Config = require('./classes/WatchConfig');
const config = new Config();

module.exports = config.export();
