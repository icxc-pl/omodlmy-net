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
if (config.mode.dev) {
  ALLOWED_ORIGINS = [
    'https://local.omodlmy.net:8000',
    'https://local.omodlmy.net:8001'
  ];
} else {
  ALLOWED_ORIGINS = config.security.allowedOrigins;
}

/**
 * Allowed HTTP Methods
 * @type {string[]}
 * @constant
 */
const ALLOWED_HTTP_METHODS = ['GET', 'POST'];
if (config.mode.dev) {
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
      ApiError.NOT_ALLOWED.response(res);
    }
  },

  /**
   * CORS Middleware
   */
  cors(req, res, next) {
    // Website you wish to allow to connect
    const origin = req.headers.origin || req.headers.referer.replace(/\/$/, '');

    if (ALLOWED_ORIGINS === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', false);
      res.sendStatus(400);
      return;
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
      secure: config.security.secureCookie,
      maxAge: config.session.duration / 1000,
      httpOnly: true,
      sameSite: 'strict'
    }
  })

};

module.exports = SecurityController;
