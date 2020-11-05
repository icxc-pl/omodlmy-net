'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('md');
rule.use('html-loader');
rule.use('markdown-loader');

module.exports = rule.export();
