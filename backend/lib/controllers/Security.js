'use strict';

const helmet = require('helmet');
const csurf = require('csurf');
const config = require('../../config');
const ApiError = require('../classes/ApiError');

/**
 * Security Controller
 */

 /**
  * Allowed Origins
  */
let ALLOWED_ORIGINS;
if (config.modeDev) {
  ALLOWED_ORIGINS = [
    'https://local.omodlmy.net:8000',
    'https://local.omodlmy.net:8001'
  ];
} else if (config.modeStaging) {
  ALLOWED_ORIGINS = [
    'https://staging.omodlmy.net'
  ];
} else {
  ALLOWED_ORIGINS = [
    'https://omodlmy.net'
  ];
}

/**
 * Allowed HTTP Methods
 * @type {string[]}
 * @constant
 */
const ALLOWED_HTTP_METHODS = ['GET', 'POST'];
if (config.modeDev) {
  ALLOWED_HTTP_METHODS.push('OPTIONS');
}


const SecurityController = {

  /**
   * Helmet Middleware
   * https://www.npmjs.com/package/helmet
   */
  helmet: helmet(),

  /**
   * Check if used HTTP method is allowed
   */
  allowedMethods(req, res, next) {
    if (ALLOWED_HTTP_METHODS.includes(req.method.toUpperCase())) {
      next();
    } else {
      ApiError.NOT_ALLOWED.reposne(res);
    }
  },

  /**
   * CORS Middleware
   */
  cors(req, res, next) {
    // Website you wish to allow to connect
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (ALLOWED_ORIGINS.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // intercept OPTIONS method
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    } else {
      // Pass to next layer of middleware
      next();
    }
  },

  /**
   * XSRF Middleware
   * https://www.npmjs.com/package/csurf
   */
  xsrf: csurf({
    ignoreMethods: ['GET', 'OPTIONS'],
    cookie: {
      key: '__Host-csrf-token',
      signed: false,
      secure: true,
      maxAge: config.sessionDuration / 1000,
      httpOnly: true,
      sameSite: 'strict'
    }
  })

};

module.exports = SecurityController;
