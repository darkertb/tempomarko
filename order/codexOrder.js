const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');
const TimeUtil = require('../util/timeUtil');
const OrderBase = require('./orderBase');
const OrderEntity = require('./orderEntity');

const DAILY_SAFE_QUOTA = 100 / 7;
const WORKDAY_SAFE_QUOTA = 100 / 5;
const SAFE_BUFFER_RATIO = 0.3;
const WEEKDAY_LABELS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

class CodexOrder extends OrderBase {
  constructor() {
    super();
  }

  getOrderList() {

    const result = [
      new OrderEntity({
        keyword: 'c',
        description: 'show weekly quota safety baseline',
        example: '{{keyword}} 45 (check remaining quota status with 45%)',
        func: this._show.bind(this),
      }),
    ];

    this.orderList = result;
    return result;
  }

  _show({ otherArgs }) {

    if (otherArgs.length > 1) {
      return this._printError('Codex command accepts one optional remaining percentage');
    }

    const outputList = this._formatWeeklyBaselineLines();

    if (otherArgs.length === 1) {
      const remainingQuota = Number(otherArgs[0]);

      if (Number.isNaN(remainingQuota) || remainingQuota < 0 || remainingQuota > 100) {
        return this._printError('Remaining quota must be a number between 0 and 100');
      }

      outputList.push('');
      outputList.push(...this._formatTodayStatusLines(remainingQuota));
    }

    colt(outputList.join('\n')).log();
  }

  _formatWeeklyBaselineLines() {

    const currentWeekNumber = this._getCurrentWeekNumber();
    const parts = [];

    for (let index = 0; index < WEEKDAY_LABELS.length; index++) {
      const weekNumber = index + 1;
      const isToday = weekNumber === currentWeekNumber;
      const label = colt(WEEKDAY_LABELS[index]).color256(isToday ? myThemes.white : myThemes.grey);
      const expectedRemaining = colt(this._formatPercent(this._getExpectedRemaining(weekNumber))).color256(isToday ? myThemes.helpExample : myThemes.white);

      if (isToday) {
        label.bold();
        expectedRemaining.bold();
      }

      const part = [`${label.t()} ${expectedRemaining.t()}`];

      if (weekNumber < 6) {
        const workdayExpectedRemaining = colt(`(${this._formatPercent(this._getExpectedWorkdayRemaining(weekNumber))})`).color256(isToday ? myThemes.helpExample : myThemes.grey);

        if (isToday) {
          workdayExpectedRemaining.bold();
        }

        part.push(workdayExpectedRemaining.t());
      }

      parts.push(part.join(' '));
    }

    return [parts.join('  ')];
  }

  _formatTodayStatusLines(remainingQuota) {

    const weekNumber = this._getCurrentWeekNumber();
    const expectedRemaining = this._getExpectedRemaining(weekNumber);
    const safeBufferThreshold = this._getSafeBufferThreshold(weekNumber);
    const status = this._getStatus(remainingQuota, expectedRemaining, safeBufferThreshold);
    const availableQuota = remainingQuota - expectedRemaining;

    return [
      this._formatSectionTitle('今日狀態'),
      this._formatRemainingLine(status, remainingQuota),
      this._formatAvailableLine(availableQuota, remainingQuota, expectedRemaining),
    ];
  }

  _formatSectionTitle(title) {

    return colt(title).color256(myThemes.helpTitle).bold().underline().t();
  }

  _formatRemainingLine(status, remainingQuota) {

    const labelText = colt('剩餘:').color256(myThemes.white).t();
    const remainingText = colt(this._formatCompactPercent(remainingQuota)).color256(status.color).bold().t();

    return `  ${labelText} ${remainingText}`;
  }

  _formatAvailableLine(availableQuota, remainingQuota, expectedRemaining) {

    const labelText = colt('可用:').color256(myThemes.white).t();
    const availableText = colt(this._formatCompactPercent(availableQuota)).color256(this._getAvailableColor(availableQuota)).bold().t();
    const formulaText = colt(`(${this._formatCompactPercent(remainingQuota)} - ${this._formatCompactPercent(expectedRemaining)})`).color256(myThemes.grey).t();

    return `  ${labelText} ${availableText} ${formulaText}`;
  }

  _getAvailableColor(availableQuota) {

    if (availableQuota <= 0) {
      return myThemes.danger;
    }

    if (availableQuota > 5) {
      return myThemes.info;
    }

    return myThemes.warn;
  }

  _formatCompactPercent(value) {

    return `${Number(value.toFixed(2)).toString()}%`;
  }

  _getCurrentWeekNumber() {

    const day = TimeUtil.getTzDate().getDay();

    return day === 0 ? 7 : day;
  }

  _getExpectedRemaining(weekNumber) {

    return 100 - DAILY_SAFE_QUOTA * weekNumber;
  }

  _getExpectedWorkdayRemaining(weekNumber) {

    if (weekNumber >= 6) {
      return 0;
    }

    return 100 - WORKDAY_SAFE_QUOTA * weekNumber;
  }

  _getSafeBufferThreshold(weekNumber) {

    return this._getExpectedRemaining(weekNumber) + DAILY_SAFE_QUOTA * SAFE_BUFFER_RATIO;
  }

  _getStatus(remainingQuota, expectedRemaining, safeBufferThreshold) {

    if (remainingQuota > safeBufferThreshold) {
      return {
        label: '安全',
        color: myThemes.info,
      };
    }

    if (remainingQuota < expectedRemaining) {
      return {
        label: '不安全',
        color: myThemes.danger,
      };
    }

    return {
      label: '注意',
      color: myThemes.warn,
    };
  }

  _formatPercent(value) {

    return `${value.toFixed(2)}%`;
  }

  _printError(message) {

    colt(message).color256(myThemes.danger).log();
  }
}

module.exports = CodexOrder;
