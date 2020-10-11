'use strict';

const config = require('../../config');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


/**
 * Session Controller
 */
class SessionController {

  /**
   * Constructor
   * @param {DBController} dbController
   */
  constructor(dbController) {
    this.config = config;
    this.dbController = dbController;

    // Setup store
    this.store = new MongoDBStore({
      uri: config.dbConnectionUri,
      databaseName: config.dbName,
      collection: config.sessionDbCollection
    });
  }

  /**
   * Get Express Integration
   */
  expressIntegration() {
    return session({
      store: this.store,
      secret: this.config.sessionSecret,
      name: this.config.sessionCookieName,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: this.config.sessionDuration,
        path: '/',
        sameSite: 'strict',

        // cookie.secure requires to setup reverse-proxy
        // X-Forwarded-Proto: https
        //
        // Apache2:
        //   RequestHeader set X-Forwarded-Proto "https"
        //
        // ngnix:
        //   proxy_set_header X-Forwarded-Proto https;
        //
        // https://github.com/expressjs/session/issues/281#issuecomment-191359194
        secure: this.config.modeProduction
      }
    });
  }

  /**
   * Returns true if given session is valid
   *
   * @param {object} session Session from Express Request object
   * @returns {boolean} Verdict
   */
  isValid(session) {
    return session != null && session.id != null;
  }

  /**
   * Add intention
   *
   * @param {object} session Session from Express Request object
   * @param {object} intention Intention
   */
  addIntention(session, intention) {
    if (session.intentions == null) {
      session.intentions = [];
    }

    session.intentions.push(
      this.dbController.getDriver().getDBRef(intention._id)
    );
  }

  /**
   * Join prayer
   *
   * @param {object} session Session from Express Request object
   * @param {object} intention Intention
   */
  joinPrayer(session, intention) {
    if (session.joined == null) {
      session.joined = [];
    }

    session.joined.push(
      this.dbController.getDriver().getDBRef(intention._id)
    );
  }

  /**
   * Returns true if session user has joined given intention
   *
   * @param {object} session Session from Express Request object
   * @param {string} intentionId Intention Id
   * @returns {boolean} Verdict
   */
  hasJoined(session, intentionId) {
    return session != null
      && Array.isArray(session.joined)
      && session.joined.some((ref) => ref.oid.toString() === intentionId);
  }

  /**
   * Mark which intentions has been joined already
   *
   * @param {object} session Session from Express Request object
   * @param {Array<Object>} intentions Array of intentions
   * @returns {Array<Object>} Array of intentions
   */
  markJoined(session, intentions) {
    for (const intention of intentions) {
      intention.joined = this.hasJoined(session, intention._id.toString());
    }
    return intentions;
  }

}

// Exports
module.exports = SessionController;
