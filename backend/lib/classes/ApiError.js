'use strict';

const UsersError = require('./UsersError');

class ApiError extends UsersError {

  /**
   * Constructor
   * @param {string} [message] Message
   * @param {number} [status] Status Code
   */
  constructor(message = ApiError.BAD_REQUEST, status = 400, details = null) {
    super(message, details);
    this.message = message;
    this.status = status;
  }

  /**
   * Set details
   * @param {*} details
   */
  setDetails (details) {
    this.details = details;
    return this;
  }

  /**
   * To Object
   * @returns {Object}
   */
  toObject() {
    let obj = {
      message: this.message,
      status: this.status
    };

    if (this.details != null) {
      obj.details = this.details;
    }

    return obj;
  }

  /**
   * Response using given handler
   * @param {*} res
   */
  response(res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(this.status).send(this.toObject());
  }

}

/**
 * Bad Request
 * Means that received request is invalid for some reason
 */
ApiError.BAD_REQUEST = new ApiError('ERROR_BAD_REQUEST', 400);

/**
 * Not Found
 * Means that server couldn't find what user was looking for
 */
ApiError.NOT_FOUND = new ApiError('ERROR_NOT_FOUND', 404);

/**
 * Method Not Allowed
 * Means that used HTTP method is not allowed
 */
ApiError.NOT_ALLOWED = new ApiError('ERROR_METHOD_NOT_ALLOWED', 405);

/**
 * Internal Server Error
 * Means that something very bad is going on, and server didn't catched that - not good
 */
ApiError.INTERNAL = new ApiError('ERROR_INTERNAL', 500);

/**
 * Invalid JSON
 * Means that received data is invalid JSON
 */
ApiError.INVALID_JSON = new ApiError('ERROR_INVALID_JSON', 400);

/**
 * Invalid Session
 * Means that received request cannot be handled because of invalid session
 */
ApiError.INVALID_SESSION = new ApiError('ERROR_INVALID_SESSION', 401);

/**
 * User Tried to do dirty stuff?
 */
ApiError.SECURITY = new ApiError('ERROR_SECURITY', 401);

/**
 * Create ApiError from UsersError
 * @param {UsersError} err
 * @param {number} [status]
 * @returns {ApiError}
 */
ApiError.fromUsersError = (err, status = undefined) => {
  return new ApiError(err.message, status, err.details);
};

// Exports
module.exports = ApiError;
