const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');
const TimeUtil = require('../util/timeUtil');

class CalculateAfterOrder {
  constructor() { }

  /**
   * @param {string|number[]} units
   *
   * @memberOf CalculateAfterHandle
   */
  run(units) {

    if (units.indexOf('+') === -1 && units.indexOf('-') === -1 && units.indexOf('*') === -1 && units.indexOf('/') === -1) {
      return true;
    }

    const a = units[0];
    const symbol = units[1];
    const b = units[2];

    const calculateFunc = (a, symbol, b) => {
      if (symbol === '+') {
        return a + b;
      }
      else if (symbol === '-') {
        return a - b;
      }
      else if (symbol === '*') {
        return a * b;
      }
      else if (symbol === '/') {
        return a / b;
      }
    };

    const result = calculateFunc(a, symbol, b);

    const formattedResult = this.formatResult(this.format2Time(result));

    colt(
      `Note: ${colt('1年 = 12個月 = 30日').color256(myThemes.grey)}\n\n`
      + `Formula: ${colt(`${TimeUtil.getTzDate(a * 1000).format()} ${symbol} ${TimeUtil.getTzDate(b * 1000).format()}`).color256(myThemes.grey).italic()}\n\n`
      + formattedResult).log();

    return false;
  }

  format2Time(seconds) {

    const isNegative = seconds < 0;

    seconds = Math.abs(seconds);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const remainingDays = days % 30;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const result = {
      isNegative,
      years,
      months: remainingMonths,
      days: remainingDays,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    };

    return result;
  }

  formatResult(timeSource) {

    const timeColtFunc = (str) => {
      return colt(str).color256(timeSource.isNegative ? myThemes.danger : myThemes.info).bold();
    };

    const parts = [];
    if (timeSource.isNegative) {
      parts.push(colt('-'));
    }
    if (timeSource.years > 0) {
      parts.push(`${timeColtFunc(timeSource.years)} 年`);
    }
    if (timeSource.months > 0) {
      parts.push(`${timeColtFunc(timeSource.months)} 個月`);
    }
    if (timeSource.days > 0) {
      parts.push(`${timeColtFunc(timeSource.days)} 日`);
    }
    if (timeSource.hours > 0) {
      parts.push(`${timeColtFunc(timeSource.hours)} 小時`);
    }
    if (timeSource.minutes > 0) {
      parts.push(`${timeColtFunc(timeSource.minutes)} 分鐘`);
    }
    if (timeSource.seconds > 0) {
      parts.push(`${timeColtFunc(timeSource.seconds)} 秒`);
    }

    if (parts.length === 0) {
      parts.push(`${timeColtFunc(0)} 秒`);
    }

    const totalDays = timeSource.days + timeSource.months * 30 + timeSource.years * 360;
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    if (weeks > 0) {
      parts.push(colt(`(${colt(weeks).color256(myThemes.orange).bold()} 週 ${colt(remainingDays).color256(myThemes.orange).bold()} 日)`).color256(myThemes.yellow));
    }
    if (totalDays > 0) {
      parts.push(colt(`(${colt(totalDays).color256(myThemes.orange).bold()} 日)`).color256(myThemes.yellow));
    }

    return parts.join('  ');
  }
}

module.exports = CalculateAfterOrder;
