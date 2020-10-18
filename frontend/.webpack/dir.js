const path = require('path');

const dir = {
  root: path.resolve(__dirname, '..'),
  repo: undefined,
  common: undefined,
  src: undefined,
  assets: undefined,
  img: undefined,
  static: undefined,
  dist: undefined
};

dir.repo = path.resolve(dir.root, '..');
dir.common = path.resolve(dir.repo, 'common');
dir.src = path.resolve(dir.root, 'src');
dir.assets = path.resolve(dir.src, 'assets');
dir.img = path.resolve(dir.assets, 'img');
dir.static = path.resolve(dir.src, 'static');
dir.dist = path.resolve(dir.root, 'dist');

module.exports = dir;
