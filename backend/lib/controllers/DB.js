'use strict';

const DBError = require('../classes/DBError');

const SORT_PARAM = {
  createTime: -1
};


/**
 * DB Controller
 */
class DBController {

  /**
   * Constructor
   */
  constructor() {
    this.driverName = 'MongoDB'; // it can be parametrized in future (if needed)
    this.driver = null;
  }

  /**
   * Init
   */
  init() {
    return this.getDriver().whenReady;
  }

  /**
   * Get Driver
   *
   * @returns {AbstractDriver}
   */
  getDriver() {
    if (this.driver == null) {
      let Driver = require(`../drivers/${this.driverName}`);
      this.driver = new Driver();
    }
    return this.driver;
  }

  /**
   * Get Collection `intentions`
   */
  getCollectionIntentions() {
    return this.getDriver().getCollection('intentions');
  }

  /**
   * Get Collection `sessions`
   */
  getCollectionSessions() {
    return this.getDriver().getCollection('sessions');
  }

  /**
   * Get Collection `stats`
   */
  getCollectionStats() {
    return this.getDriver().getCollection('stats');
  }

  /**
   * Get Stats
   * @returns {Promise}
   */
  getStats() {
    return this.getCollectionStats().find({}, {
      projection: {
        _id: false
      }
    }).toArray().then((data) => data[0]);
  }

  /**
   * Get Intentions
   * @param {number} offset Offset
   * @param {number} limit Limit
   * @param {Object} findParams find Params
   * @returns {Promise}
   */
  getIntentions(offset, limit, findParams = undefined) {
    return this.getCollectionIntentions().find(findParams).skip(offset).limit(limit).sort(SORT_PARAM).toArray();
  }

  /**
   * Get Intentions of User with given Id
   * @param {string} id Id
   * @returns {Promise}
   */
  getUserIntentionsFromLastDay(id) {
    return this.getIntentions(0, 0, {
      authorHash: id,
      createTime: {
        $gt: Date.now() - Date.DAY
      }
    });
  }

  /**
   * Add Intention
   *
   * @param {Intention} intention Intention
   * @returns {Promise}
   */
  async addIntention(intention) {
    const res = await this.getCollectionIntentions().insertOne(intention);
    return res.ops[0];
  }

  /**
   * Increment intentions counter
   * @returns {Promise}
   */
  incrementIntentionsCounter() {
    return this.getCollectionStats().updateOne({}, {
      $inc: {
        intentions: 1
      }
    });
  }

  /**
   * Increment praying counter
   * @returns {Promise}
   */
  incrementPrayingCounter() {
    return this.getCollectionStats().updateOne({}, {
      $inc: {
        praying: 1
      }
    });
  }

  /**
   * Join prayer
   * Increases number of praying people in the Intention
   * @param {string} intentionId Intention Id
   * @returns {Promise}
   */
  async joinPrayer(intentionId) {
    if (intentionId == null || !this.getDriver().isIdValid(intentionId)) {
      throw DBError.INVALID_ID;
    }

    const res = await this.getCollectionIntentions().findOneAndUpdate({
      _id: this.getDriver().getObjectId(intentionId)
    }, {
      $inc: {
        praying: 1
      }
    }, {
      projection: {
        praying: true
      },
      returnOriginal: false
    });

    if (res.value == null) {
      throw DBError.INTENTION_NOT_FOUND;
    }

    return res.value;
  }

  /**
   * Get Prayers
   * @returns {Promise}
   */
  async getPrayers(sessionId) {
    const items = await this.getCollectionSessions().aggregate([
      {
        $match: {
          _id: sessionId
        }
      },
      {
        $project: {
          joinedIds: {
            $map: {
              input: {
                $map: {
                  input: "$session.joined",
                  in: {
                    $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
                  }
                }
              },
              in: "$$this.v"
            }
          }
        }
      },
      {
        $lookup: {
          from: "intentions",
          localField: "joinedIds",
          foreignField: "_id",
          as: "joined"
        }
      }
    ]).toArray();

    return items.length > 0 ? items[0].joined : [];
  }

}


module.exports = DBController;
