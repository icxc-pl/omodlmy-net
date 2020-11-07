'use strict';

const AbstractDriver = require('./Abstract');
const { MongoClient, ObjectId, DBRef } = require('mongodb');

const MONGODB_CONNECT_PARAMS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const REQUIRED_COLLECTIONS = [
  'intentions',
  'stats'
];

const REQUIRED_INDEXES = {
  intentions: ['authorId']
};


/**
 * MongoDB Driver
 */
class MongoDBDriver extends AbstractDriver {

  /**
   * Constructor
   */
  constructor() {
    super();
    this._client = null;
  }

  /**
   * Connect
   * @returns {Promise} Client promise
   */
  connect() {
    if (this._client == null) {
      return this._connect();
    } else {
      return this._client;
    }
  }

  /**
   * Connect
   * @private
   * @returns {Promise} Client promise
   */
  async _connect() {
    this.debug(`Connecting to ${this.config.db.connectionUri}`);

    try {
      this._client = await MongoClient.connect(this.config.db.connectionUri, MONGODB_CONNECT_PARAMS);
      this.debug(`Connected!`);
      await this.validateStructure();
      return this._client;
    } catch (err) {
      this.debug(`Connection error! ${err}`);
      return err;
    }
  }

  /**
   * Close
   * @returns {*}
   */
  close() {
    const ret = this._client.close();
    this._client = null;
    return ret;
  }

  /**
   * Debug
   * @param {string} msg Debug message
   */
  debug(msg) {
    console.log(`mongo: ${msg}`);
  }

  /**
   * Validate DB Structure
   */
  async validateStructure() {
    this.debug('Validating DB Structure...');
    const db = await this.getDb();

    // Collections
    console.log(`       Checking collections...`);
    const collectionsInDb = await db.listCollections().toArray();
    for (const collectionName of REQUIRED_COLLECTIONS) {
      if (collectionsInDb.some((collectionInfo) => collectionInfo.name === collectionName)) {
        console.log(`       ✅ ${collectionName}`);
      } else {
        console.log(`       ❎ ${collectionName}; Creating...`);
        const res = await db.createCollection(collectionName);
        if (res.error != null) {
          throw res.error;
        }
        console.log(`       ✅ Success`);
      }
    }

    // Index
    console.log(`       Checking indexes...`);
    for (const collectionName in REQUIRED_INDEXES) {
      const indexInfo = await db.indexInformation(collectionName);
      for (const indexName of REQUIRED_INDEXES[collectionName]) {
        let found = false;
        for (const indexInfoKey in indexInfo) {
          if (indexInfo[indexInfoKey].some((index) => index[0] === indexName)) {
            found = true;
            break;
          }
        }
        if (found) {
          console.log(`       ✅ ${indexName} @ ${collectionName}`);
        } else {
          console.log(`       ❎ ${indexName} @ ${collectionName}; Creating...`);
          const res = await db.createIndex(collectionName, indexName);
          if (res.error != null) {
            throw res.error;
          }
          console.log(`       ✅ Success`);
        }
      }
    }

    // Stats
    console.log(`       Checking stats...`);
    const $stats = db.collection('stats');

    let res = await $stats.find({}, {
      projection: {
        _id: false
      }
    }).toArray();

    let recalculate = false;

    if (res.length > 0) {
      const stats = res[0];
      if (typeof stats.intentions === 'number' && stats.intentions >= 0
      && typeof stats.praying === 'number' && stats.praying >= 0) {
        console.log(`       ✅ Everything is fine`);
      } else {
        console.log(`       ❎ Fixing...`);
        recalculate = true;
      }
    } else {
      console.log(`       ❎ Creating...`);
      recalculate = true;
    }

    if (recalculate) {
      // clean
      await $stats.deleteMany({});

      // count intentions
      const $intentions = db.collection('intentions');
      const intentions = await $intentions.countDocuments({});

      // count praying
      let praying;
      if (intentions > 0) {
        res = await $intentions.aggregate([
          {
            $group: {
              _id: null,
              praying: { $sum: "$praying" }
            }
          }
        ]).toArray();
        praying = res[0].praying;
      } else {
        praying = 0;
      }

      // insert
      res = await $stats.insertOne({
        intentions,
        praying,
      });

      if (res.error != null) {
        throw res.error;
      }
      console.log(`       ✅ Success`);
    }

  }

  /**
   * Get DB
   * @returns {MongoDB.MongoClient} Db
   */
  getDb() {
    return this._client.db(this.config.db.name);
  }

  /**
   * Get collection with given collectionName
   * @param {string} collectionName Collection name
   */
  getCollection(collectionName) {
    return this.getDb().collection(collectionName);
  }

  /**
   * Check if given Id is valid
   * @param {string} id Id
   * @returns {boolean}
   */
  isIdValid(id) {
    return ObjectId.isValid(id);
  }

  /**
   * Get ObjectId from Id
   * @param {string} id Id
   * @returns {ObjectId}
   */
  getObjectId(id) {
    return id instanceof ObjectId ? id : new ObjectId(id);
  }

  /**
   * Get DBRef
   * @param {string|ObjectId} id
   * @param {string} [ref='intentions']
   * @returns {DBRef}
   */
  getDBRef(id, ref = 'intentions') {
    return new DBRef(ref, this.getObjectId(id));
  }

}

// exports
module.exports = MongoDBDriver;
