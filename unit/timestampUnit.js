class TimestampUnit {
  constructor() { }

  /**
   *
   *
   * @param {Object} options
   * @param {number} options.index
   * @param {string} options.source
   * @param {number} options.prevLastUnit
   * @param {number} options.lastUnit
   * @returns {number}
   *
   * @memberOf TimestampUnit
   */
  parse({ source }) {

    if (isNaN(Number(source))) {
      return null;
    }

    if (source.length !== 10 && source.length !== 13) {
      return null;
    }

    if (source.length === 13) {
      source = Math.round(Number(source) / 1000);
    }

    return source;
  }
}

module.exports = TimestampUnit;
