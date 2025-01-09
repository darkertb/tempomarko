const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../userConfig/timezone.json');

class TimezoneService {
  constructor() { }

  getUsedTimezone() {

    const timezoneInfo = this.readFile();

    return timezoneInfo.timezone;
  }

  getLocalTimezone() {

    return new Date().getTimezoneOffset() / 60 * -1;

  }

  getAllTemplates() {

    const timezoneInfo = this.readFile();
    if (timezoneInfo.template === undefined) {
      timezoneInfo.template = {};
    }

    return timezoneInfo.template;
  }

  /**
   *
   *
   * @param {string} name
   * @param {number} timezone
   *
   * @memberOf TimezoneService
   */
  addTimezoneTemplate(name, timezone) {

    const timezoneInfo = this.readFile();

    if (timezoneInfo.template === undefined) {
      timezoneInfo.template = {};
    }

    timezoneInfo.template[name] = timezone;

    this.writeFile(timezoneInfo);
  }

  /**
   *
   *
   * @param {string} name
   * @returns {number|null}
   *
   * @memberOf TimezoneService
   */
  switchTimezoneByTemplate(name) {

    const timezoneInfo = this.readFile();

    if (timezoneInfo.template === undefined) {
      return null;
    }

    const newTimezone = timezoneInfo.template[name];

    this.setTimezone(newTimezone);

    return newTimezone || null;
  }

  resetTimezone() {

    const localTimezone = this.getLocalTimezone();
    this.setTimezone(localTimezone);

    return localTimezone;
  }

  /**
   *
   *
   * @param {number} timezone
   *
   * @memberOf TimezoneService
   */
  setTimezone(timezone) {

    const timezoneInfo = this.readFile();

    timezoneInfo.timezone = timezone;

    this.writeFile(timezoneInfo);
  }

  /**
   *
   *
   * @returns {import('../userConfig/timezone.json')}
   *
   * @memberOf TimezoneService
   */
  readFile() {

    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  }

  writeFile(content) {

    fs.writeFileSync(FILE_PATH, JSON.stringify(content), 'utf8');
  }
}

module.exports = TimezoneService;
