'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('css');
rule.use('style-loader');
rule.use('vue-style-loader');
rule.use('css-loader');

module.exports = rule.export();
