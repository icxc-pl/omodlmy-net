'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('js');
rule.exclude(/node_modules/);
rule.use('babel-loader', {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3
        }
      }
    ]
  ]
});

module.exports = rule.export();
