'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('less');
rule.use('style-loader');
rule.use('vue-style-loader');
rule.use('css-loader');
rule.use('less-loader');

module.exports = rule.export();
