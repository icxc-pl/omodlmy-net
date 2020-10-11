'use strict';

const AbstractDriver = require('./Abstract');
const { MongoClient, ObjectId, DBRef } = require('mongodb');

const MONGODB_CONNECT_PARAMS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
    this.activeClient = null;
    this.whenReady = this.connect();
  }

  /**
   * Connect
   *
   * @returns {Promise} Client promise
   */
  connect() {
    this.debug(`Connecting to ${this.config.dbConnectionUri}`);
    return MongoClient.connect(this.config.dbConnectionUri, MONGODB_CONNECT_PARAMS).catch((err) => {
      this.debug(`Connection error! ${err}`);
      return err;
    }).then((client) => {
      this.activeClient = client;
      this.debug(`Connected!`);
      return client;
    });
  }

  /**
   * Close
   *
   * @returns {*}
   */
  close() {
    const ret = this.activeClient.close();
    this.activeClient = null;
    return ret;
  }

  /**
   * Debug
   *
   * @param {string} msg Debug message
   */
  debug(msg) {
    console.log(`mongo: ${msg}`);
  }

  /**
   * Get DB
   *
   * @returns {MongoDB.MongoClient} Db
   */
  getDb() {
    return this.activeClient.db(this.config.dbName);
  }

  /**
   * Get collection with given collectionName
   *
   * @param {string} collectionName Collection name
   */
  getCollection(collectionName) {
    return this.getDb().collection(collectionName);
  }

  /**
   * Check if given Id is valid
   *
   * @param {string} id Id
   * @returns {boolean}
   */
  isIdValid(id) {
    return ObjectId.isValid(id);
  }

  /**
   * Get ObjectId from Id
   *
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
