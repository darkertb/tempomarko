const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');
const TimeUtil = require('../util/timeUtil');
const { codexService, timezoneService } = require('../store/serviceStore');
const OrderBase = require('./orderBase');
const OrderEntity = require('./orderEntity');

const DAILY_SAFE_QUOTA = 100 / 7;
const WORKDAY_SAFE_QUOTA = 100 / 5;
const SAFE_BUFFER_RATIO = 0.3;
const WEEK_SECONDS = 168 * 60 * 60;
const DAY_SECONDS = 24 * 60 * 60;
const RESET_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}),(\d{2}):(\d{2}):(\d{2})$/;
const DAY_LABELS = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];

class CodexOrder extends OrderBase {
  constructor() {
    super();

    this.service = codexService;
  }

  getOrderList() {

    const result = [
      new OrderEntity({
        keyword: 'c',
        description: 'show codex quota safety baseline',
        example: '{{keyword}} 45 yyyy-MM-dd,hh:mm:ss (check status and set weekly reset time)',
        func: this._show.bind(this),
      }),
    ];

    this.orderList = result;
    return result;
  }

  _show({ otherArgs }) {

    const parsedArgs = this._parseArgs(otherArgs);

    if (parsedArgs.error !== null) {
      return this._printError(parsedArgs.error);
    }

    const resetTimestampResult = this._resolveResetTimestamp(parsedArgs.resetTimeText);

    if (resetTimestampResult.error !== null) {
      return this._printError(resetTimestampResult.error);
    }

    const weekNumber = this._getCurrentWeekNumber(resetTimestampResult.resetTimestamp);
    const outputList = this._formatWeeklyBaselineLines(weekNumber);

    outputList.push('');
    outputList.push(this._formatResetSavedLine(resetTimestampResult.resetTimestamp));

    if (parsedArgs.remainingQuota !== null) {
      outputList.push('');
      outputList.push(...this._formatTodayStatusLines(parsedArgs.remainingQuota, weekNumber));
    }

    colt(outputList.join('\n')).log();
  }

  _parseArgs(otherArgs) {

    if (otherArgs.length > 2) {
      return {
        error: 'Codex command accepts optional remaining percentage and weekly reset time',
      };
    }

    let remainingQuota = null;
    let resetTimeText = null;

    if (otherArgs.length === 1) {
      if (this._looksLikeResetTime(otherArgs[0])) {
        resetTimeText = otherArgs[0];
      }
      else {
        remainingQuota = this._parseRemainingQuota(otherArgs[0]);
      }
    }
    else if (otherArgs.length === 2) {
      remainingQuota = this._parseRemainingQuota(otherArgs[0]);
      resetTimeText = otherArgs[1];
    }

    if (remainingQuota !== null && remainingQuota.error !== undefined) {
      return remainingQuota;
    }

    if (resetTimeText !== null && !RESET_TIME_PATTERN.test(resetTimeText)) {
      return {
        error: 'Weekly reset time must use yyyy-MM-dd,hh:mm:ss format',
      };
    }

    return {
      error: null,
      remainingQuota,
      resetTimeText,
    };
  }

  _parseRemainingQuota(value) {

    const remainingQuota = Number(value);

    if (Number.isNaN(remainingQuota) || remainingQuota < 0 || remainingQuota > 100) {
      return {
        error: 'Remaining quota must be a number between 0 and 100',
      };
    }

    return remainingQuota;
  }

  _looksLikeResetTime(value) {

    return value.includes('-') || value.includes(',') || value.includes(':');
  }

  _resolveResetTimestamp(resetTimeText) {

    if (resetTimeText !== null) {
      const parsedResetTimestamp = this._parseResetTimestamp(resetTimeText);

      if (parsedResetTimestamp.error !== null) {
        return parsedResetTimestamp;
      }

      const validationError = this._validateActiveResetTimestamp(parsedResetTimestamp.resetTimestamp);

      if (validationError !== null) {
        return {
          error: validationError,
        };
      }

      this.service.setWeeklyResetTimestamp(parsedResetTimestamp.resetTimestamp);

      return {
        error: null,
        resetTimestamp: parsedResetTimestamp.resetTimestamp,
        saved: true,
      };
    }

    const savedResetTimestamp = this.service.getWeeklyResetTimestamp();

    if (savedResetTimestamp === null) {
      return {
        error: 'Weekly reset time is required. Please provide yyyy-MM-dd,hh:mm:ss at least once',
      };
    }

    const validationError = this._validateActiveResetTimestamp(savedResetTimestamp);

    if (validationError !== null) {
      return {
        error: 'Saved weekly reset time is no longer valid. Please provide yyyy-MM-dd,hh:mm:ss again',
      };
    }

    return {
      error: null,
      resetTimestamp: savedResetTimestamp,
      saved: false,
    };
  }

  _parseResetTimestamp(resetTimeText) {

    const matches = resetTimeText.match(RESET_TIME_PATTERN);

    if (matches === null) {
      return {
        error: 'Weekly reset time must use yyyy-MM-dd,hh:mm:ss format',
      };
    }

    const [, yearText, monthText, dateText, hourText, minuteText, secondText] = matches;
    const year = Number(yearText);
    const month = Number(monthText);
    const date = Number(dateText);
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const second = Number(secondText);

    const timestamp = Math.round((Date.UTC(year, month - 1, date, hour, minute, second) / 1000) - timezoneService.getUsedTimezone() * 60 * 60);
    const formattedResetTime = TimeUtil.getTzDate(timestamp * 1000).format('yyyy-MM-dd,hh:mm:ss');

    if (formattedResetTime !== resetTimeText) {
      return {
        error: 'Weekly reset time is not a valid date',
      };
    }

    return {
      error: null,
      resetTimestamp: timestamp,
    };
  }

  _validateActiveResetTimestamp(resetTimestamp) {

    const nowTimestamp = TimeUtil.getTzDate().getTimestamp();
    const resetDiffSeconds = resetTimestamp - nowTimestamp;

    if (resetDiffSeconds <= 0) {
      return 'Weekly reset time is already past';
    }

    if (resetDiffSeconds > WEEK_SECONDS) {
      return 'Weekly reset time must be within 168 hours from now';
    }

    return null;
  }

  _formatWeeklyBaselineLines(currentWeekNumber) {

    const parts = [];

    for (let index = 0; index < DAY_LABELS.length; index++) {
      const weekNumber = index + 1;
      const isToday = weekNumber === currentWeekNumber;
      const label = colt(DAY_LABELS[index]).color256(isToday ? myThemes.white : myThemes.grey);
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

  _formatTodayStatusLines(remainingQuota, weekNumber) {

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

  _formatResetSavedLine(resetTimestamp) {

    const labelText = colt('週重置:').color256(myThemes.white).t();
    const resetText = colt(TimeUtil.getTzDate(resetTimestamp * 1000).format('yyyy-MM-dd,hh:mm:ss')).color256(myThemes.info).bold().t();

    return `  ${labelText} ${resetText}`;
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

  _getCurrentWeekNumber(resetTimestamp) {

    const nowTimestamp = TimeUtil.getTzDate().getTimestamp();
    const windowStartTimestamp = resetTimestamp - WEEK_SECONDS;
    const elapsedSeconds = nowTimestamp - windowStartTimestamp;
    const weekNumber = Math.floor(elapsedSeconds / DAY_SECONDS) + 1;

    return Math.min(Math.max(weekNumber, 1), 7);
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
