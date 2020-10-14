'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule(/\.woff2?$/);
rule.use('file-loader', {
  name: 'assets/fonts/[name].[ext]',
  esModule: false
});

module.exports = rule.export();
