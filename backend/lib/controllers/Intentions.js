'use strict';

const validator = require('../services/validator');
const Intention = require('../classes/Intention');
const UsersError = require('../classes/UsersError');

// Define user daily limit
const USER_DAILY_LIMIT = 5;
const USER_COOLDOWN = 5 * Date.SECOND;


/**
 * Intentions Controller
 */
class IntentionsController {

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
   * Get List of Intentions
   *
   * @param {object} query
   * @param {object} session
   * @param {boolean} [onlyMine=false]
   * @returns {Promise}
   */
  async getList(query, session, onlyMine = false) {
    let findParams;

    if (onlyMine) {
      findParams = {
        authorId: session.id
      };
    }

    const intentions = await this.dbController.getIntentions(query.offset, query.limit, findParams);
    return await this.sessionController.markJoined(session, intentions);
  }

  /**
   * Add Intentions
   * @param {object} intention
   * @param {object} session
   * @returns {Promise}
   */
  async add(intention, session) {
    if (!validator.validateIntention(intention)) {
      console.log(intention);
      throw validator.validateIntention.errors;
    }

    const intentionToAdd = new Intention(intention.content, session.id, intention.author);
    const intentionAdded = await this.dbController.addIntention(intentionToAdd);
    this.dbController.incrementIntentionsCounter(); // we do not need to wait for this one
    await this.sessionController.addIntention(session, intentionAdded);
    return intentionAdded;
  }

  /**
   * Validate User Limit
   *
   * @param {string} id User's Id
   * @returns {Promise}
   */
  async validateUserLimit(id) {
    const items = await this.dbController.getUserIntentionsFromLastDay(id);

    // check only if there are any items
    if (items.length > 0) {

      // exceeded daily limit
      if (items.length >= USER_DAILY_LIMIT) {
        throw UsersError.dailyLimit(items[items.length - 1].createTime);
      }

      // too quick - cooldown
      else if (Date.now() - items[0].createTime < USER_COOLDOWN) {
        throw UsersError.cooldown(items[0].createTime);
      }

    }

    return items;
  }

}

// Exports
module.exports = IntentionsController;
