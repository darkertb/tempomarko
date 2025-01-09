const DateUnit = require('../unit/dateUnit');
const OperationUnit = require('../unit/operationUnit');
const TimestampUnit = require('../unit/timestampUnit');

const unitTools = [
  new TimestampUnit(),
  new DateUnit(),
  new OperationUnit(),
];

class UnitHandler {
  constructor() {

    this.timestampUnit = new TimestampUnit();
    this.dateUnit = new DateUnit();
    this.operationUnit = new OperationUnit();
  }

  /**
   *
   *
   * @param {string[]} args
   * @returns {number[]}
   *
   * @memberOf UnitHandler
   */
  parseUnit(args) {

    const result = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      let unit = null;

      const parseOptions = { index: i, source: arg, prevLastUnit: result[result.length - 2], lastUnit: result[result.length - 1] };

      for (const unitTool of unitTools) {

        unit = unitTool.parse(parseOptions);

        if (unit !== null) {
          if (Array.isArray(unit)) {
            result.push(...unit);
          }
          else {
            result.push(Number(unit));
          }
          break;
        }
      }

      if (unit === null) {
        result.push(arg);
      }
    }

    return result;
  }
}

module.exports = UnitHandler;
