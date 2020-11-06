'use strict';

const path = require('path');
const localConfig = require('./config.json');


const mode = {
  /**
   * Is production server mode enabled?
   * @type {boolean}
   * @constant
   */
  production: process.env.NODE_ENV === 'production',

  /**
   * Is staging server mode enabled?
   * @type {boolean}
   * @constant
   */
  staing: process.env.NODE_ENV === 'staging',

  /**
   * Is dev server mode enabled?
   * @type {boolean}
   * @constant
   */
  dev: process.env.NODE_ENV === 'dev'
};


const service = {
  /**
   * Service Port
   * @type {number}
   * @constant
   */
  port: 8001,

  /**
   * Service Listen Addr
   * @type {string}
   * @constant
   */
  listenAddr: '0.0.0.0',

  /**
   * Service Https
   * @type {string}
   * @constant
   */
  https: mode.dev,

  /**
   * Service Home Path
   * @type {string}
   * @constant
   */
  home: path.resolve(__dirname)
};


const db = {
  /**
   * Database Name
   * @type {string}
   * @constant
   */
  name: 'omodlmy-net',

  /**
   * Database Host
   * @type {string}
   * @constant
   */
  host: 'localhost',

  /**
   * Database Port
   * @type {number}
   * @constant
   */
  port: 27017,

  /**
   * Database Connection URI
   * @type {string}
   * @constant
   */
  connectionUri: undefined
};
db.connectionUri = `mongodb://${db.host}:${db.port}/${db.name}`


const session = {
  /**
   * Session Secret (itself)
   * @type {string}
   * @constant
   */
  secret: undefined,

  /**
   * Session Cookie Name
   * @type {string}
   * @constant
   */
  cookieName: 'prayerHash',

  /**
   * Session Database Collection
   * @type {string}
   * @constant
   */
  dbCollection: 'sessions',

  /**
   * Session Duration
   * @type {number}
   * @contstant
   */
  duration: 40 * Date.DAY
};


const security = {

  /**
   * Allowed Origins
   */
  allowedOrigins: [
    'https://omodlmy.net'
  ],

  /**
   * Secure Cookie
   */
  secureCookie: !mode.dev

};


// Config
const config = Object.deepAssign({
  mode,
  service,
  db,
  session,
  security
}, localConfig);


// Exports
module.exports = config;
