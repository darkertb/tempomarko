const { colt } = require('../lib/cols');
const { timezoneService } = require('../store/serviceStore');
const myThemes = require('../styles/myThemes');
const TimeUtil = require('../util/timeUtil');
const OrderBase = require('./orderBase');
const OrderEntity = require('./orderEntity');

const createCommonUseOrder = (description, func) => {
  return {
    description,
    func,
  };
};

class CommonUseOrder extends OrderBase {
  constructor() {
    super();

    this.map = {
      ls: createCommonUseOrder('list all orders', () => {
        const keys = Object.keys(this.map).filter((key) => key !== 'ls');
        const result = keys.map((key) => {
          return `${key} : ${this.map[key].description}`;
        }).join('\n');
        colt(result).color256(myThemes.helpTitle).log();
      }),
      pm: createCommonUseOrder('get prev month timestamp', this._prevMonth.bind(this)),
      m: createCommonUseOrder('get whole month timestamp', this._wholeMonth.bind(this)),
      pw: createCommonUseOrder('get prev week timestamp', this._prevWeek.bind(this)),
      w: createCommonUseOrder('get whole week timestamp', this._wholeWeek.bind(this)),
      pd: createCommonUseOrder('get prev day timestamp', this._prevDay.bind(this)),
      d: createCommonUseOrder('get whole day timestamp', this._wholeDay.bind(this)),
      ph: createCommonUseOrder('get prev hour timestamp', this._prevHour.bind(this)),
      h: createCommonUseOrder('get whole hour timestamp', this._wholeHour.bind(this)),
    };
  }

  getOrderList() {

    const result = [
      new OrderEntity({
        keyword: ['.'],
        description: 'get common use timestamp',
        example: '{{keyword}}pd (get prev whole day timestamp)',
        func: this._use.bind(this),
      }),
    ];

    this.orderList = result;
    return result;
  }

  /**
   *
   *
   * @param {OrderBase.OrderActionParameters} orderActionParameters
   *
   * @memberOf CommonUseOrder
   */
  _use({ otherArgs }) {

    const [arg] = otherArgs;

    if (this.map[arg] === undefined) {
      throw new Error(`[CommonUseOrder] [${arg}] is not defined`);
    }

    this._printUsedTimezone();
    this.map[arg].func();
  }

  _printUsedTimezone() {

    const localTimezone = timezoneService.getLocalTimezone();
    const getUsedTimezone = timezoneService.getUsedTimezone();

    const color = localTimezone === getUsedTimezone ? myThemes.black : myThemes.white;
    const bgColor = localTimezone === getUsedTimezone ? myThemes.info : myThemes.warn;

    colt(`Timezone: UTC ${getUsedTimezone}`).color256(color).bgColor256(bgColor).log();
  }

  _prevMonth() {

    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    sDate.setDate(1);
    sDate.addMonth(-1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addMonth(1);

    colt(`[Prev month] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _wholeMonth() {

    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    sDate.setDate(1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addMonth(1);

    colt(`[Whole month] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _prevWeek() {

    // get prev whole week begin monday
    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    sDate.addDate(-sDate.getDay() - 6);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(7);

    colt(`[Prev week] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _wholeWeek() {

    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    sDate.addDate(-sDate.getDay() + 1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(7);

    colt(`[Whole week] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _prevDay() {

    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    sDate.addDate(-1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(1);

    colt(`[Prev day] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _wholeDay() {

    const sDate = TimeUtil.getTzDate();
    sDate.setHours(0, 0, 0, 0);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addDate(1);

    colt(`[Whole day] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _prevHour() {

    const sDate = TimeUtil.getTzDate();
    sDate.setMinutes(0, 0, 0);
    sDate.addHours(-1);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addHours(1);

    colt(`[Prev hour] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }

  _wholeHour() {

    const sDate = TimeUtil.getTzDate();
    sDate.setMinutes(0, 0, 0);
    const eDate = TimeUtil.getTzDate(sDate);
    eDate.addHours(1);

    colt(`[Whole hour] [${sDate.format()}] [${eDate.format()}] ${sDate.getTimestamp()} ${eDate.getTimestamp()}`).color256(myThemes.item).log();
  }
}

module.exports = CommonUseOrder;
