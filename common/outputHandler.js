const { timezoneService } = require('../store/serviceStore');
const TimeUtil = require('../util/timeUtil');
const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');
class OutputHandler {
  constructor() { }

  /**
   *
   *
   * @param {number[]} units
   * @returns {string}
   *
   * @memberOf OutputHandler
   */
  parse(units) {

    const localTimezone = timezoneService.getLocalTimezone();
    const getUsedTimezone = timezoneService.getUsedTimezone();

    const color = localTimezone === getUsedTimezone ? myThemes.black : myThemes.black;
    const bgColor = localTimezone === getUsedTimezone ? myThemes.info : myThemes.warn;

    const outputList = [
      colt(`Timezone: UTC ${getUsedTimezone}`).color256(color).bgColor256(bgColor).t(),
    ];

    if (units.length === 1) {

      const unit = units[0];

      const _date = TimeUtil.getTzDate(unit * 1000);

      const firstDayOnMonth = TimeUtil.getDate(unit);
      firstDayOnMonth.setDate(1);
      firstDayOnMonth.setHours(0, 0, 0, 0);
      const lastDayOnMonth = TimeUtil.getDate(unit);
      lastDayOnMonth.setMonth(lastDayOnMonth.getMonth() + 1);
      lastDayOnMonth.setDate(0);
      lastDayOnMonth.setHours(24, 0, 0, 0);

      const prevFirstDayOnMonth = TimeUtil.getDate(unit);
      prevFirstDayOnMonth.setDate(1);
      prevFirstDayOnMonth.setMonth(prevFirstDayOnMonth.getMonth() - 1);
      prevFirstDayOnMonth.setHours(0, 0, 0, 0);
      const prevLastDayOnMonth = TimeUtil.getDate(unit);
      prevLastDayOnMonth.setDate(0);
      prevLastDayOnMonth.setHours(24, 0, 0, 0);

      const localDate = new Date(unit * 1000);

      const localTimeText = localTimezone === getUsedTimezone
        ? []
        : [
          colt(`UTC+${localTimezone} [LOCAL TIME] [${TimeUtil.dateFormat(localDate)}]`).color256(myThemes.localTime).bold().italic(),
        ];

      if (!isNaN(_date)) {
        outputList.push(
          ...localTimeText,
          '',
          // eslint-disable-next-line max-len
          this.getWholeMonth(unit),
          // '',
          // this.getPrevWeek(unit),
          // '',
          this.getWholeWeek(unit),
          // '',
          this.getWholeDay(unit),
          // '',
          this.getPrevHour(unit),
          '',
        );
      }
    }

    for (let i = 0; i < units.length; i++) {
      let unit = units[i];
      const date = TimeUtil.getDate(unit);

      if (isNaN(date)) {
        outputList.push(colt('[Invalid date]').red().t());
        continue;
      }

      const dateText = TimeUtil.dateFormat(date);

      outputList.push(
        colt(`[Item ${i + 1}] [${dateText}]: ${unit}`).color256(i % 2 ? myThemes.item : myThemes.item2).bold().t(),
      );
    }

    return outputList.join('\n');
  }

  getPrevHour(unit) {

    const sDate = TimeUtil.getTzDate(unit * 1000);
    sDate.setHours(sDate.getHours() - 1, 0, 0, 0);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addHours(1);

    return colt(`[Prev hour] [${sDate.format()}] [${eDate.format()}]: ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.lastHour).t();
  }

  getWholeDay(unit) {

    const sDate = TimeUtil.getTzDate(unit * 1000);
    sDate.setHours(0, 0, 0, 0);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(1);

    return colt(`[Whole day] [${sDate.format()}] [${eDate.format()}]: ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.wholeDay).t();
  }

  getPrevWeek(unit) {

    const sDate = TimeUtil.getTzDate(unit * 1000);
    sDate.setHours(0, 0, 0, 0);
    sDate.addDate(-sDate.getDay() - 6);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(7);

    return colt(`[Prev week] [${sDate.format()}] [${eDate.format()}]: ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.lastWeek).t();
  }

  getWholeWeek(unit) {

    const sDate = TimeUtil.getTzDate(unit * 1000);
    sDate.setHours(0, 0, 0, 0);
    sDate.addDate(-sDate.getDay() + 1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(7);

    return colt(`[Whole week] [${sDate.format()}] [${eDate.format()}]: ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.wholeWeek).t();
  }

  getWholeMonth(unit) {

    const sDate = TimeUtil.getTzDate(unit * 1000);
    sDate.setHours(0, 0, 0, 0);
    sDate.setDate(1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addMonth(1);

    return colt(`[Whole month] [${sDate.format()}] [${eDate.format()}]: ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.wholeMonth).t();
  }
}

module.exports = OutputHandler;
