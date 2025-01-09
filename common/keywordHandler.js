const TimeUtil = require('../util/timeUtil');

class KeywordHandler {
  constructor() { }

  /**
   *
   *
   * @param {string[]} args
   * @returns {string[]}
   *
   * @memberOf KeywordHandler
   */
  replace(args) {

    const result = [];

    const tzDate = TimeUtil.getTzDate();

    for (const arg of args) {
      result.push(
        arg
          .replace(/n/g, tzDate.getTimestamp())
          .replace(/yy/g, tzDate.format('yyyy'))
          .replace(/MM/g, tzDate.format('MM'))
          .replace(/dd/g, tzDate.format('dd'))
          .replace(/hh/g, tzDate.format('hh'))
          .replace(/mm/g, tzDate.format('mm'))
          .replace(/ss/g, tzDate.format('ss'))
          .replace(/date/g, tzDate.format('yyyyMMdd'))
          .replace(/time/g, tzDate.format('hhmmss')),
      );
    }

    return result;
  }
}

module.exports = KeywordHandler;
