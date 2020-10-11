'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('vue');
rule.use('vue-loader');

module.exports = rule.export();
