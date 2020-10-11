class Rule {

  constructor(test) {
    this._test = typeof test === 'string' ? new RegExp(`\\.${test}$`) : test;
    this._exclude = undefined;
    this._use = [];
  }

  exclude (val) {
    this._exclude = val;
  }

  use (loader, options = {}) {
    this._use.push({
      loader,
      options
    });
  }

  export () {
    const rule = {};
    for (const key in this) {
      if (this.hasOwnProperty(key) && key[0] === '_') {
        rule[key.substr(1)] = this[key];
      }
    }
    return rule;
  }

}

module.exports = Rule;
