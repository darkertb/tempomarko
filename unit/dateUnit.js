const NumberUtil = require('../util/numberUtil');
const TimeUtil = require('../util/timeUtil');

class DateUnit {
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
   * @memberOf DateUnit
   */
  parse({ source }) {

    const splitted = source.split(',').map((text) => this._formatDateTimeText(text));

    if (splitted.length > 1) {
      const parsedText = this._parseDateTimeText(...splitted);
      return TimeUtil.getTimestamp(new Date(parsedText));
    }
    else if (NumberUtil.isNumber(source)) {
      const passParams = source.length > 6 ? [splitted[0], ''] : ['', splitted[0]];
      const parsedText = this._parseDateTimeText(...passParams);
      return TimeUtil.getTimestamp(new Date(parsedText));
    }

    return null;
  }

  _formatDateTimeText(text) {

    const splitSymbol = ['/', '-', ':'];

    const usedSymbol = splitSymbol.find((symbol) => text.includes(symbol));
    if (usedSymbol === undefined) {
      return text;
    }

    const textSplitted = text.split(usedSymbol);

    const first = textSplitted[0] ? textSplitted[0] : '';
    const second = textSplitted[1] ? textSplitted[1].padStart(2, '0') : '';
    const third = textSplitted[2] ? textSplitted[2].padStart(2, '0') : '';

    return `${first}${second}${third}`;
  }

  /**
   *
   *
   * @param {string} dateText
   * @param {string} timeText
   * @returns
   *
   * @memberOf DateUnit
   */
  _parseDateTimeText(dateText, timeText) {

    const outputDateText = this._parseDateText(dateText);
    const outputTimeText = this._parseTimeText(timeText);

    return outputDateText + ' ' + outputTimeText;
  }

  /**
   *
   *
   * @param {string} dateText
   * @returns {string}
   *
   * @memberOf DateUnit
   */
  _parseDateText(dateText) {

    if (dateText === '' || dateText === undefined) {
      return TimeUtil.dateFormat(TimeUtil.getDate(), 'yyyy-MM-dd');
    }

    let outputDateText = dateText;

    // 不包含年份月份
    if (dateText.length <= 2) {
      const fullYear = TimeUtil.getFullYear();
      const month = TimeUtil.getFullMonth();
      const day = dateText;

      outputDateText = `${fullYear}-${month}-${day}`;
    }
    // 不包含年份
    else if (dateText.length <= 4) {
      const fullYear = TimeUtil.getFullYear();
      const month = dateText.slice(0, dateText.length - 2);
      const day = dateText.slice(dateText.length - 2, dateText.length);

      outputDateText = `${fullYear}-${month}-${day}`;
    }
    // 必定包含年份
    else if (dateText.length <= 8) {
      const fullYear = TimeUtil.getFullYear(dateText.slice(0, dateText.length - 4));
      const month = dateText.slice(dateText.length - 4, dateText.length - 2);
      const day = dateText.slice(dateText.length - 2, dateText.length);

      outputDateText = `${fullYear}-${month}-${day}`;
    }

    return outputDateText;
  }

  /**
   *
   *
   * @param {string} timeText
   * @returns {string}
   *
   * @memberOf DateUnit
   */
  _parseTimeText(timeText) {

    if (timeText === '' || timeText === undefined) {
      return TimeUtil.dateFormat(TimeUtil.getDate(), 'hh:mm:ss');
    }

    let outputTimeText = timeText;

    if (timeText.length <= 2) {
      const n = Number(timeText);
      const hour = n <= 24 ? timeText : TimeUtil.getFullHour();
      const minute = n > 24 ? timeText : '00';
      const second = '00';

      outputTimeText = `${hour}:${minute}:${second}`;
    }
    else if (timeText.length <= 4) {
      const hour = timeText.slice(0, timeText.length - 2);
      const minute = timeText.slice(timeText.length - 2, timeText.length);
      const second = '00';

      outputTimeText = `${hour}:${minute}:${second}`;
    }
    else if (timeText.length <= 6) {
      const second = timeText.slice(timeText.length - 2, timeText.length);
      const minute = timeText.slice(timeText.length - 4, timeText.length - 2);
      const hour = timeText.slice(0, timeText.length - 4);

      outputTimeText = `${hour}:${minute}:${second}`;
    }

    return outputTimeText;
  }
}

module.exports = DateUnit;
