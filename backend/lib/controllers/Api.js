'use strict';

const UsersError = require('../classes/UsersError');
const ApiError = require('../classes/ApiError');
const validator = require('../services/validator');

/**
 * Api Controller
 */
class ApiController {

  /**
   * Constructor
   * @param {Express} srv Express Server Instance
   * @param {StatsController} statsController Statistics Controller
   * @param {IntentionsController} intentionsController Intentions Controller
   * @param {PrayersController} prayersController Prayers Controller
   * @param {SessionController} sessionController Session Controller
   */
  constructor(
    srv,
    statsController,
    intentionsController,
    prayersController,
    sessionController
  ) {
    this.srv = srv;

    this.statsController = statsController;
    this.intentionsController = intentionsController;
    this.prayersController = prayersController;
    this.sessionController = sessionController;
  }

  /**
   * Method
   * @param {string} method HTTP Method
   * @param {string} path Path
   * @param {string} handler Handler
   */
  _method(method, path, handler) {
    this.srv[method](path, this[handler].bind(this));
  }

  /**
   * HEAD
   * @param {string} path Path
   * @param {string} handler Handler
   */
  HEAD(path, handler) {
    this._method('head', path, handler);
  }

  /**
   * GET
   * @param {string} path Path
   * @param {string} handler Handler
   */
  GET(path, handler) {
    this._method('get', path, handler);
  }

  /**
   * POST
   * @param {string} path Path
   * @param {string} handler Handler
   */
  POST(path, handler) {
    this._method('post', path, handler);
  }

  /**
   * Handle Internal Server Errors
   * @param {*} err Error
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  // eslint-disable-next-line no-unused-vars
  handleInternalServerErrors(err, req, res, next) {
    let apiError;
    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
      apiError = ApiError.INVALID_JSON;
    } else if (err != null && err.code === 'EBADCSRFTOKEN') {
      apiError = ApiError.SECURITY;
    } else {
      apiError = ApiError.INTERNAL;
    }
    apiError.response(res);
  }

  /**
   * Handle Other Cases
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  handleOtherCases(req, res) {
    ApiError.NOT_FOUND.response(res);
  }

  /**
   * Get Meta
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  getMeta(req, res) {
    res.header('X-CSRF-Token', req.csrfToken());
    res.status(200).send();
  }

  /**
   * Get Stats
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async getHomeStats(req, res) {
    try {
      const stats = await this.statsController.getHomeStats();
      res.status(200).send(stats);
    } catch(err) {
      try {
        ApiError.BAD_REQUEST.setDetails(err.message).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

  /**
   * Get Intentions
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async getIntentions(req, res) {
    if (!validator.validateQuery(req.query)) {
      console.warn(validator.validateQuery.errors);
      ApiError.BAD_REQUEST.response(res);
      return;
    }

    try {
      const intentions = await this.intentionsController.getList(req.query, req.session);
      res.status(200).send(intentions);
    } catch(err) {
      try {
        ApiError.BAD_REQUEST.setDetails(err.message).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

  /**
   * Get My Intentions
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async getMyIntentions(req, res) {
    if (!validator.validateQuery(req.query)) {
      console.warn(validator.validateQuery.errors);
      ApiError.BAD_REQUEST.response(res);
      return;
    }

    try {
      const intentions = await this.intentionsController.getList(req.query, req.session, true);
      res.status(200).send(intentions);
    } catch(err) {
      try {
        ApiError.BAD_REQUEST.setDetails(err.message).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

  /**
   * Add Intention
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async addIntention(req, res) {
    if(!this.sessionController.isValid(req.session)) {
      try {
        ApiError.INVALID_SESSION.response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
      return;
    }

    if (!validator.validateIntention(req.body.data)) {
      const err = validator.validateIntention.errors[0];
      const what = err.keyword.toUpperCase();
      const where = err.dataPath.slice(1).toUpperCase();
      ApiError.BAD_REQUEST.setDetails(`ERROR_INVALID_${what}_${where}`).response(res);
      return;
    }

    try {
      if (typeof req.session.captcha !== 'number' || req.session.captcha !== req.body.data.captcha) {
        throw UsersError.INVALID_CAPTCHA;
      }
    } catch (err) {
      try {
        ApiError.fromUsersError(err, 401).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
      return;
    }

    try {
      await this.intentionsController.validateUserLimit(req.session.id);
    } catch (err) {
      try {
        ApiError.fromUsersError(err, 429).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
      return;
    }

    try {
      const intention = await this.intentionsController.add(req.body.data, req.session);

      // Clear captcha for session
      req.session.captcha = null;

      res.status(201).send({
        id: intention._id
      });
    } catch (err) {
      try {
        ApiError.BAD_REQUEST.setDetails(err.message).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

  /**
   * Join Prayer
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async joinPrayer(req, res) {
    if(!this.sessionController.isValid(req.session)) {
      ApiError.INVALID_SESSION.response(res);
      return;
    }

    try {
      const intention = await this.prayersController.join(req.params.id, req.session);
      res.status(201).send(intention);
    } catch (err) {
      try {
        if(err == null) {
          ApiError.BAD_REQUEST.response(res);
        } else {
          new ApiError(err.message, err.message.includes('NOT_FOUND') ? 404 : 400).response(res);
        }
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

  /**
   * Joined Prayers
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async joinedPrayers(req, res) {
    try {
      const intentions = await this.prayersController.getList(req.session);
      res.status(200).send(intentions);
    } catch(err) {
      try {
        ApiError.BAD_REQUEST.setDetails(err.message).response(res);
      } catch (err) {
        console.error(err);
        ApiError.INTERNAL.response(res);
      }
    }
  }

}

module.exports = ApiController;
