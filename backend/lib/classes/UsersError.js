'use strict';

class UsersError extends Error {

  /**
   * Constructor
   * @param {string} message Message
   * @param {Object} details Details
   */
  constructor(message, details) {
    super(message);
    this.message = message;
    this.details = details;
  }

  withDetails(details) {
    return new this.constructor(this.message, details)
  }
}

/**
 * Invalid ID
 */
UsersError.INVALID_ID = new UsersError('ERROR_INVALID_ID');

/**
 * Invalid Syntax of Author
 * Means that User has send author, that is invalid with the White List.
 */
UsersError.INVALID_SYNTAX_AUTHOR = new UsersError('ERROR_INVALID_SYNTAX_AUTHOR');

/**
 * Invalid Syntax of Content
 * Means that User has send content, that is invalid with the White List.
 */
UsersError.INVALID_SYNTAX_CONTENT = new UsersError('ERROR_INVALID_SYNTAX_CONTENT');

/**
 * Invalid Captcha
 * Means that User has send captcha, that is not valid with stored in session
 */
UsersError.INVALID_CAPTCHA = new UsersError('ERROR_INVALID_CAPTCHA');

/**
 * Empty Content
 * Means that User is trying to POST empty content.
 */
UsersError.EMPTY_CONTENT = new UsersError('ERROR_EMPTY_CONTENT');

/**
 * Daily Limit Exceeded
 * Means that User has exceeded daily limit of something. Created mainly for Intentions purpose.
 */
UsersError.DAILY_LIMIT_EXCEEDED = new UsersError('ERROR_DAILY_LIMIT_EXCEEDED');

/**
 * Cooldown
 * Means that User is trying to perform something that needs time to repeat - cooldown needed.
 * E.g. one is trying to POST intention again, very fast [double-click].
 */
UsersError.COOLDOWN = new UsersError('ERROR_COOLDOWN');

/**
 * Already Joined
 * Means that User is trying to join prayer that one already has joined
 */
UsersError.ALREADY_JOINED = new UsersError('ERROR_ALREADY_JOINED');

/**
 * Returns DAILY_LIMIT error
 * @see UsersError.DAILY_LIMIT_EXCEEDED
 * @returns {UsersError}
 */
UsersError.dailyLimit = (createTime) => {
  return UsersError.DAILY_LIMIT_EXCEEDED.withDetails({ createTime });
};

/**
 * Returns COOLDOWN error
 * @see UsersError.COOLDOWN
 * @returns {UsersError}
 */
UsersError.cooldown = (createTime) => {
  return UsersError.COOLDOWN.withDetails({ createTime });
};


// Exports
module.exports = UsersError;
