'use strict';

const path = require('path');

/**
 * Config
 */

/**
 * Is production server mode enabled?
 * @type {boolean}
 * @constant
 */
const modeProduction = process.env.NODE_ENV === 'production';

/**
 * Is dev server mode enabled?
 * @type {boolean}
 * @constant
 */
const modeDev = process.env.NODE_ENV === 'dev';

/**
 * Service Port
 * @type {number}
 * @constant
 */
const serverPort = 8001;

/**
 * Service Address
 * @type {string}
 * @constant
 */
const serverAddr = modeProduction ? '127.0.0.1' : '0.0.0.0';

/**
 * Service Https
 * @type {string}
 * @constant
 */
const serverHttps = !modeProduction;

/**
 * Service Home Path
 * @type {string}
 * @constant
 */
const serverHome = path.resolve(__dirname);

/**
 * Database Name
 * @type {string}
 * @constant
 */
const dbName = 'omodlmy-net';

/**
 * Database Host
 * @type {string}
 * @constant
 */
const dbHost = 'localhost';

/**
 * Database Port
 * @type {number}
 * @constant
 */
const dbPort = 27017;

/**
 * Database Connection URI
 * @type {string}
 * @constant
 */
const dbConnectionUri = `mongodb://${dbHost}:${dbPort}/${dbName}`;

/**
 * Session Secret Path
 * @type {string}
 * @constant
 */
const sessionSecretPath = path.join(serverHome, '.session-secret');

/**
 * Session Secret (itself)
 * @type {string}
 * @constant
 */
const sessionSecret = require('fs').readFileSync(sessionSecretPath, 'utf-8');

/**
 * Session Cookie Name
 * @type {string}
 * @constant
 */
const sessionCookieName = 'prayerHash';

/**
 * Session Database Collection
 * @type {string}
 * @constant
 */
const sessionDbCollection = 'sessions';

/**
 * Session Duration
 * @type {number}
 * @contstant
 */
const sessionDuration = 40 * Date.DAY;


// Exports
module.exports = {
  modeProduction,
  modeDev,

  serverPort,
  serverAddr,
  serverHttps,
  serverHome,

  dbHost,
  dbPort,
  dbName,
  dbConnectionUri,

  sessionSecretPath,
  sessionSecret,
  sessionCookieName,
  sessionDbCollection,
  sessionDuration
};
