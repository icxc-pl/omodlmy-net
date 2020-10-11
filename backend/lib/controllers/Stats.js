'use strict';

/**
 * Statistics Controller
 */
class StatsController {

  /**
   * Constructor
   *
   * @param {DBController} dbController
   * @param {SessionController} sessionController
   */
  constructor(dbController, sessionController) {
    this.dbController = dbController;
    this.sessionController = sessionController;
  }

  /**
   * Get statistics for Home screen
   *
   * @param {object} session
   * @returns {Promise}
   */
  getHomeStats() {
    return this.dbController.getStats();
  }
}

// Exports
module.exports = StatsController;
