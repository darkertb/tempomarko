const optionalValue = (source, def) => {

  if (source === undefined) {
    return def;
  }

  return source;
};

class TzDate {
  /**
   * Creates an instance of TzDate.
   * @param {Date} date
   * @param {number} timezone
   *
   * @memberOf TzDate
   */
  constructor(date, timezone) {

    this.timezone = timezone !== undefined ? timezone : TzDate.getLocalTimezone();
    this.date = date ? new Date(date) : new Date();
    this.date.setSeconds(this.date.getSeconds() + this.getTimezoneOffsetSec());
  }

  static getLocalTimezone() {
    return new Date().getTimezoneOffset() / -60;
  }

  _afterSetTime() {

    // this.date.setSeconds(this.date.getSeconds() - this.getTimezoneOffsetSec());
  }

  createAnotherTZ(timezone) {

    const date = new Date(this.date);

    date.setSeconds(date.getSeconds() - this.getTimezoneOffsetSec());

    return new TzDate(date, timezone);
  }

  getTimezoneOffsetSec() {

    const localTimezone = new Date().getTimezoneOffset() / -60;
    const timezoneOffsetHour = this.timezone - localTimezone;
    const timezoneOffsetSec = timezoneOffsetHour * 3600;

    return timezoneOffsetSec;
  }

  getTimestamp() {

    const date = new Date(this.date);

    date.setSeconds(date.getSeconds() - this.getTimezoneOffsetSec());

    return Math.round(date.getTime() / 1000);
  }

  format(fmt) {

    if (fmt == undefined) {
      fmt = 'yyyy-MM-dd hh:mm:ss';
    }

    let o = {
      'M+': this.date.getMonth() + 1, //月份
      'd+': this.date.getDate(), //日
      'h+': this.date.getHours(), //小时
      'm+': this.date.getMinutes(), //分
      's+': this.date.getSeconds(), //秒
      'q+': Math.floor((this.date.getMonth() + 3) / 3), //季度
      'S': this.date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
  }

  getFullYear() {
    return this.date.getFullYear();
  }

  getMonth() {
    return this.date.getMonth();
  }

  getDate() {
    return this.date.getDate();
  }

  getHours() {
    return this.date.getHours();
  }

  getMinutes() {
    return this.date.getMinutes();
  }

  getSeconds() {
    return this.date.getSeconds();
  }

  getMilliseconds() {
    return this.date.getMilliseconds();
  }

  getDay() {
    return this.date.getDay();
  }

  getTime() {
    return this.getTimestamp() * 1000;
  }

  addFullYear(years) {
    this.date.setFullYear(this.date.getFullYear() + years);
    this._afterSetTime();
    return this;
  }

  addMonth(months) {
    this.date.setMonth(this.date.getMonth() + months);
    this._afterSetTime();
    return this;
  }

  addDate(days) {
    this.date.setDate(this.date.getDate() + days);
    this._afterSetTime();
    return this;
  }

  addHours(hours) {
    this.date.setHours(this.date.getHours() + hours);
    this._afterSetTime();
    return this;
  }

  addMinutes(minutes) {
    this.date.setMinutes(this.date.getMinutes() + minutes);
    this._afterSetTime();
    return this;
  }

  addSeconds(seconds) {
    this.date.setSeconds(this.date.getSeconds() + seconds);
    this._afterSetTime();
    return this;
  }

  addMilliseconds(milliseconds) {
    this.date.setMilliseconds(this.date.getMilliseconds() + milliseconds);
    this._afterSetTime();
    return this;
  }

  setFullYear(year) {
    this.date.setFullYear(year);
    this._afterSetTime();
    return this;
  }

  setMonth(month) {
    this.date.setMonth(month);
    this._afterSetTime();
    return this;
  }

  setDate(date) {
    this.date.setDate(date);
    this._afterSetTime();
    return this;
  }

  setHours(hours, minutes, seconds, milliseconds) {

    this.date.setHours(
      hours,
      optionalValue(minutes, this.getMinutes()),
      optionalValue(seconds, this.getSeconds()),
      optionalValue(milliseconds, this.getMilliseconds()),
    );

    this._afterSetTime();
    return this;
  }

  setMinutes(minutes, seconds, milliseconds) {
    this.date.setMinutes(
      minutes,
      optionalValue(seconds, this.getSeconds()),
      optionalValue(milliseconds, this.getMilliseconds()),
    );
    this._afterSetTime();
    return this;
  }

  setSeconds(seconds, milliseconds) {
    this.date.setSeconds(
      seconds,
      optionalValue(milliseconds, this.getMilliseconds()),
    );
    this._afterSetTime();
    return this;
  }

  setMilliseconds(milliseconds) {
    this.date.setMilliseconds(milliseconds);
    this._afterSetTime();
    return this;
  }

  valueOf() {
    return this.getTime();
  }
}

module.exports = TzDate;
