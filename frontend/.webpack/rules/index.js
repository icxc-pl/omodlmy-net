'use strict';

const rules = ['js', 'vue', 'css', 'less', 'images', 'fonts'];

module.exports = rules.map((name) => require(`./${name}`));
