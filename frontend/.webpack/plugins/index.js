'use strict';

const rules = ['clean', 'constants', 'html', 'favicons', 'vue', 'copy'];

module.exports = rules.map((name) => require(`./${name}`));
