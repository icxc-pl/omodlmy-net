'use strict';

const rules = ['js', 'vue', 'css', 'less', 'images', 'md', 'fonts'];

module.exports = rules.map((name) => require(`./${name}`));
