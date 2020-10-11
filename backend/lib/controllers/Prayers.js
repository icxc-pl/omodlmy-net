'use strict';

const validator = require('../services/validator');
const UsersError = require('../classes/UsersError');


/**
 * Prayers Controller
 */
class PrayersController {

  /**
   * Constructor
   *
   * @param {DBController} dbController
   * @param {SessionController} sessionController
   */
  constructor (dbController, sessionController) {
    this.dbController = dbController;
    this.sessionController = sessionController;
  }

  /**
   * Get List of Intentions
   *
   * @param {object} session
   * @returns {Promise}
   */
  getList (session) {
    return this.dbController.getPrayers(session.id);
  }

  /**
   * Join Prayer
   * @param {string} intentionId Intention Id
   * @param {object} session
   * @returns {Promise}
   */
  async join (intentionId, session) {
    if (!validator.validateId(intentionId)) {
      throw UsersError.INVALID_ID;
    }

    if (this.sessionController.hasJoined(session, intentionId)) {
      throw UsersError.ALREADY_JOINED;
    }

    const res = await this.dbController.joinPrayer(intentionId);
    this.dbController.incrementPrayingCounter(); // nie musimy na to czekać
    await this.sessionController.joinPrayer(session, res);
    return res;
  }

}

// Exports
module.exports = PrayersController;
