const Config = require('./classes/BuildConfig');
const config = new Config();
module.exports = config.export();
