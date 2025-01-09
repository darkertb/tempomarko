const TimeUtil = require('../util/timeUtil');

const TIME_TYPE = {
  y: 'FullYear',
  M: 'Month',
  d: 'Date',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
  ms: 'Milliseconds',
};

const NEXT_TIME_SYMBOL_INFO = {
  y: ['M', 12],
  M: ['d', 30.437],
  d: ['h', 24],
  h: ['m', 60],
  m: ['s', 60],
  s: ['ms', 1000],
};

const OPERATION_SYMBOL = ['+', '-', '*', '/'];

class OperationUnit {
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
   * @memberOf OperationUnit
   */
  parse({ source, lastUnit }) {

    if (source.length <= 1) {
      return null;
    }

    const symbol = source[0];

    if (!OPERATION_SYMBOL.includes(symbol)) {
      return null;
    }

    const { sourceWithoutRepeat, repeatCount } = this.repeatHandle(source);

    const pattern = /([a-zA-Z]+)|(\d+(\.\d+)?)/g;

    const matches = sourceWithoutRepeat.slice(1).match(pattern);

    let _lastUnit = lastUnit;

    const result = [];

    for (let repeatIndex = 0; repeatIndex < repeatCount; repeatIndex++) {

      const date = TimeUtil.getTzDate(_lastUnit * 1000);

      const afterMatches = [];

      for (let i = 0; i < matches.length; i = i + 2) {

        const timeSymbol = matches[i];
        const value = Number(matches[i + 1]);

        const timeType = TIME_TYPE[timeSymbol];

        this.afterMatchesHandle(afterMatches, timeSymbol, value);

        if (timeType === undefined) {
          continue;
        }

        eval(`date.set${timeType}(date.get${timeType}() ${symbol} ${Math.floor(value)})`);
      }

      for (let i = 0; i < afterMatches.length; i++) {
        const timeSymbol = afterMatches[i];
        const value = Number(afterMatches[i + 1]);

        const timeType = TIME_TYPE[timeSymbol];
        if (timeType === undefined) {
          continue;
        }

        eval(`date.set${timeType}(date.get${timeType}() ${symbol} ${Math.floor(value)})`);
      }

      _lastUnit = date.getTimestamp();
      result.push(_lastUnit);
    }

    return result;
  }

  /**
   *
   *
   * @param {string[]} afterMatches
   * @param {string} symbol
   * @param {number} value
   *
   * @memberOf OperationUnit
   */
  afterMatchesHandle(afterMatches, symbol, value) {

    let _value = value;
    let _symbol = symbol;
    let digit = _value % 1;
    do {

      if (digit <= 0) {
        break;
      }

      const nextTimeSymbolInfo = NEXT_TIME_SYMBOL_INFO[_symbol];

      if (nextTimeSymbolInfo === undefined) {
        break;
      }

      _symbol = nextTimeSymbolInfo[0];
      _value = digit * nextTimeSymbolInfo[1];

      afterMatches.push(
        _symbol,
        Math.floor(_value),
      );

      digit = _value % 1;
    }
    while (digit > 0);
  }

  /**
   *
   *
   * @param {string} source
   * @returns
   *
   * @memberOf OperationUnit
   */
  repeatHandle(source) {

    const repeatSignIndex = source.indexOf('..');

    if (repeatSignIndex === -1) {
      return { sourceWithoutRepeat: source, repeatCount: 1 };
    }

    const repeatCount = Number(source.slice(repeatSignIndex + 2));

    const sourceWithoutRepeat = source.slice(0, repeatSignIndex);

    return { sourceWithoutRepeat: sourceWithoutRepeat, repeatCount: repeatCount };
  }
}

module.exports = OperationUnit;
