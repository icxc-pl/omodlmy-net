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
    apiError.reposne(res);
  }

  /**
   * Handle Other Cases
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  handleOtherCases(req, res) {
    ApiError.NOT_FOUND.reposne(res);
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
  getHomeStats(req, res) {
    this.statsController.getHomeStats().then((stats) => {
      res.status(200).send(stats);
    }).catch(() => {
      ApiError.BAD_REQUEST.response(res);
    });
  }

  /**
   * Get Intentions
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  getIntentions(req, res) {
    if (!validator.validateQuery(req.query)) {
      //console.log(validator.validateQuery.errors);
      ApiError.BAD_REQUEST.response(res);
      return;
    }

    this.intentionsController.getList(req.query, req.session).then((intentions) => {
      res.status(200).send(intentions);
    }).catch(() => {
      ApiError.BAD_REQUEST.response(res);
    });
  }

  /**
   * Get My Intentions
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  getMyIntentions(req, res) {
    if (!validator.validateQuery(req.query)) {
      //console.log(validator.validateQuery.errors);
      ApiError.BAD_REQUEST.response(res);
      return;
    }

    this.intentionsController.getList(req.query, req.session, true).then((intentions) => {
      res.status(200).send(intentions);
    }).catch(() => {
      ApiError.BAD_REQUEST.response(res);
    });
  }

  /**
   * Add Intention
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  async addIntention(req, res) {
    if(!this.sessionController.isValid(req.session)) {
      ApiError.INVALID_SESSION.reposne(res);
      return;
    }

    try {
      if (typeof req.session.captcha !== 'number' || req.session.captcha !== req.body.data.captcha) {
        throw UsersError.INVALID_CAPTCHA;
      }
    } catch (err) {
      ApiError.fromUsersError(err, 401).reposne(res);
      return;
    }

    try {
      await this.intentionsController.validateUserLimit(req.session.id);
    } catch (err) {
      ApiError.fromUsersError(err, 429).reposne(res);
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
      ApiError.BAD_REQUEST.response(res);
      return
    }
  }

  /**
   * Join Prayer
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  joinPrayer(req, res) {
    if(!this.sessionController.isValid(req.session)) {
      ApiError.INVALID_SESSION.reposne(res);
      return;
    }

    this.prayersController.join(req.params.id, req.session).then((intention) => {
      res.status(201).send(intention);
    }).catch((err) => {
      if(err == null) {
        ApiError.BAD_REQUEST.response(res);
      } else {
        new ApiError(err.message, err.message.includes('NOT_FOUND') ? 404 : 400).reposne(res);
      }
    });
  }

  /**
   * Joined Prayers
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  joinedPrayers(req, res) {
    this.prayersController.getList(req.session).then((intentions) => {
      res.status(200).send(intentions);
    }).catch(() => {
      ApiError.BAD_REQUEST.response(res);
    });
  }

}

module.exports = ApiController;
