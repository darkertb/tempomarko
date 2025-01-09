const TzDate = require('../common/tzDate');
const timezone = require('../userConfig/timezone.json');

class TimeUtil {

  /**
   *
   *
   * @static
   * @param {string} halfYear
   * @returns {string}
   *
   * @memberOf TimeUtil
   */
  static getFullYear(halfYear=undefined) {

    const fullYear = this.dateFormat(TimeUtil.getDate(), 'yyyy');

    return halfYear === undefined ? fullYear : (fullYear.slice(0, 4 - halfYear.length) + halfYear);
  }

  static getFullMonth() {

    return this.dateFormat(TimeUtil.getDate(), 'MM');
  }

  static getFullHour() {

    return this.dateFormat(TimeUtil.getDate(), 'hh');
  }

  static getTzDate(value = undefined) {

    return new TzDate(value, timezone.timezone);
  }

  static getDate(timestamp = undefined) {

    const localTimezone = new Date().getTimezoneOffset() / 60 * -1;
    const timezoneOffsetHour = timezone.timezone - localTimezone;
    const timezoneOffsetSec = timezoneOffsetHour * 3600;

    if (timestamp === undefined) {
      timestamp = Math.round(new Date() / 1000);
    }

    timestamp += timezoneOffsetSec;

    return new Date(timestamp * 1000);
  }

  static getTimestamp(date=undefined) {

    if (date === undefined) {
      date = this.getDate();
    }

    const localTimezone = new Date().getTimezoneOffset() / 60 * -1;
    const timezoneOffsetHour = timezone.timezone - localTimezone;
    const timezoneOffsetSec = timezoneOffsetHour * 3600;

    return Math.round(date/1000) - timezoneOffsetSec;
  }

  static dateFormat(date, fmt) {
    if (fmt == undefined) {
      fmt = 'yyyy-MM-dd hh:mm:ss';
    }

    if (typeof (date) === 'number') {
      date = new Date(date * 1000);
    }

    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
  }
}

module.exports = TimeUtil;
