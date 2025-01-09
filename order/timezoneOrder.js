const OrderEntity = require('./orderEntity');
const OrderBase = require('./orderBase');
const { timezoneService } = require('../store/serviceStore');
const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');

class TimezoneOrder extends OrderBase {
  constructor() {
    super();

    this.service = timezoneService;
  }

  getOrderList() {

    const result = [
      new OrderEntity({
        keyword: ['list', 'ls'],
        description: 'Show timezone template list',
        example: '{{keyword}}',
        func: this._list.bind(this),
      }),
      new OrderEntity({
        keyword: 'add',
        description: 'Add timezone template',
        example: '{{keyword}} vn 7 (add timezone template vn is +0700)',
        func: this._add.bind(this),
      }),
      new OrderEntity({
        keyword: 'get',
        description: 'Switch timezone from specify template',
        example: '{{keyword}} jp (set timezone to jp template\'s timezone)',
        func: this._switchTo.bind(this),
      }),
      new OrderEntity({
        keyword: 'set',
        description: 'Set Timezone',
        example: '{{keyword}} 6 (set timezone to +0600) | {{keyword}} jp (set timezone to jp template\'s timezone)',
        func: this._set.bind(this),
      }),
      new OrderEntity({
        keyword: ['reset', 'rs'],
        description: 'Reset timezone',
        example: '{{keyword}} (reset timezone to os default)',
        func: this._reset.bind(this),
      }),
    ];

    this.orderList = result;
    return result;
  }

  /**
   *
   *
   * @memberOf TimezoneOrder
   */
  _list() {

    const list = this.service.getAllTemplates();

    colt(Object.keys(list).map(
      (key) => `(${colt(key).color256(myThemes.name).t()}) => ${list[key]}`,
    ).join('\n')).log();
  }

  /**
   *
   *
   * @param {OrderBase.OrderActionParameters} orderActionParameters
   *
   * @memberOf TimezoneOrder
   */
  _add({ otherArgs }) {

    const name = otherArgs[0];
    const timezone = Number(otherArgs[1]);

    if (isNaN(timezone)) {
      return colt(`Timezone must be number`).color256(myThemes.danger).log();
    }

    this.service.addTimezoneTemplate(name, timezone);

    const diffFromDefaultTimezone = timezone !== this.service.getLocalTimezone();
    const color = diffFromDefaultTimezone ? myThemes.warn : myThemes.info;

    colt(`Add timezone template: (${colt(name).color256(myThemes.name)}) => ${colt(timezone).color256(color)}`).log();
  }

  /**
   *
   *
   * @param {OrderBase.OrderActionParameters} orderActionParameters
   *
   * @memberOf TimezoneOrder
   */
  _switchTo({ otherArgs }) {

    const name = otherArgs[0];

    const timezone = this.service.switchTimezoneByTemplate(name);

    if (timezone === null) {
      return colt(`Timezone template: (${colt(name).color256(myThemes.name)}) not found`).color256(myThemes.danger).log();
    }

    const diffFromDefaultTimezone = timezone !== this.service.getLocalTimezone();
    const bgColor = diffFromDefaultTimezone ? myThemes.warn : myThemes.info;
    const color = diffFromDefaultTimezone ? myThemes.white : myThemes.black;

    colt(`Switch timezone template: ${colt(name).color256(myThemes.name)} => ${colt('UTC ' + timezone).color256(color).bgColor256(bgColor)}`).log();
  }

  /**
   *
   *
   * @param {OrderBase.OrderActionParameters} orderActionParameters
   *
   * @memberOf TimezoneOrder
   */
  _set({ otherArgs }) {

    const timezone = Number(otherArgs[0]);

    if (isNaN(timezone)) {
      return this._switchTo({ otherArgs });
    }

    this.service.setTimezone(timezone);

    const diffFromDefaultTimezone = timezone !== this.service.getLocalTimezone();
    const backgroundColor = diffFromDefaultTimezone ? myThemes.warn : myThemes.info;
    const color = diffFromDefaultTimezone ? myThemes.white : myThemes.black;

    colt(`Set timezone: ${colt('UTC ' + timezone).color256(color).bgColor256(backgroundColor)}`).log();
  }

  _reset() {

    const localTimezone = this.service.resetTimezone();

    colt(`Reset timezone: ${colt('UTC ' + localTimezone).color256(myThemes.black).bgColor256(myThemes.info).t()}`).log();
  }
}

module.exports = TimezoneOrder;
