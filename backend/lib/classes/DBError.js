'use strict';

class DBError extends Error {}

/**
 * Invalid Id
 * Means that given Id, isn't valid Database Id.
 */
DBError.INVALID_ID = new DBError('ERROR_INVALID_ID');

/**
 * Intention Not Found
 * Means that Intention with given Id, coudln't be found in the Database.
 */
DBError.INTENTION_NOT_FOUND = new DBError('ERROR_INTENTION_NOT_FOUND');

// Exports
module.exports = DBError;
