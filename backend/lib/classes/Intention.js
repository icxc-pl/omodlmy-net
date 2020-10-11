'use strict';

const validator = require('../services/validator');
const UsersError = require('./UsersError');

/**
 * Intention
 */
class Intention {

  constructor(content, authorId, author = null) {

    // content
    this.content = content.trim().replace(/\s{2,}/g, ' ');
    if (this.content.length == 0) {
      throw UsersError.EMPTY_CONTENT;
    } else if (!validator.validateText(content)) {
      throw UsersError.INVALID_SYNTAX_CONTENT;
    }

    // authorId (sessionId)
    this.authorId = authorId;

    // author
    this.author = null;
    if (typeof author == 'string') {
      this.author = author.trim();

      if (this.author.length == 0) {
        this.author = null;
      } else {
        if (!validator.validateText(this.author)) {
          throw UsersError.INVALID_SYNTAX_AUTHOR;
        }
      }
    }

    // create time
    this.createTime = Date.now();

    // praying
    this.praying = 0;
  }

}

// Alias
Intention.isValid = validator.validateIntention;

// Exports
module.exports = Intention;
