'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
rule.use('url-loader', {
  limit: 10 * 1024,
  esModule: false
});

module.exports = rule.export();
