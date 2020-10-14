'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
rule.use('url-loader', {
  limit: 10 * 1024,
  name: 'assets/images/[name].[ext]',
  esModule: false
});

module.exports = rule.export();
