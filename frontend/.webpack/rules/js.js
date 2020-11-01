'use strict';

const Rule = require('../classes/Rule');

const rule = new Rule('js');
rule.exclude(/node_modules/);
rule.use('babel-loader', {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'entry',
        corejs: {
          version: 3
        },
        modules: 'cjs'
      }
    ]
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: 3
      }
    ]
  ]
});

module.exports = rule.export();
