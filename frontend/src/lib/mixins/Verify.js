export default {
  methods: {

    /**
     * Validate
     * @returns {Boolean}
     */
    validate () {
      this._verifyReset();
      var rulesNames = Object.keys(this.verify.$rules);
      rulesNames.forEach((name) => {
        this.verify[name].$dirty = true;
      });
      this.$forceUpdate();
      return this.verify.$valid;
    },

    /**
     * Verify Reset
     * @private
     */
    _verifyReset () {
      var rules = this.verify.$rules;
      if (rules) {
        this.$verify(rules);
      }
      return;
    }

  }
};
