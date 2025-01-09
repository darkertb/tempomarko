const OrderBase = require('./orderBase');
const OrderEntity = require('./orderEntity');
const { colt } = require('../lib/cols');
const myThemes = require('../styles/myThemes');

const runCode = 'tt';

class HelperOrder extends OrderBase {
  constructor() {
    super();
  }

  getOrderList() {

    const result = [
      new OrderEntity({
        keyword: ['help', '-h', 'h'],
        description: 'Show help',
        example: '{{keyword}}',
        func: this._show.bind(this),
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
   * @memberOf HelperOrder
   */
  _show({ orderHandlers }) {

    console.log();
    console.log('----------------------------------------------------------------');

    orderHandlers.forEach((orderHandler) => {
      for (const order of orderHandler.orderList) {
        const orderText = `[${colt(Array.isArray(order.keyword) ? order.keyword.join(',') : order.keyword).color256(myThemes.helpTitle).t()}]`.padEnd(28, ' ');
        const example = colt(`ex: ${runCode} ${order.example.replace(/{{keyword}}/g, Array.isArray(order.keyword) ? order.keyword[0] : order.keyword)}`).color256(myThemes.helpExample);
        const description = order.description.padEnd(42, ' ');
        colt(`${orderText}${description}${example}`).log(false);
      }
      console.log('----------------------------------------------------------------');
    });

    console.log();
  }
}

module.exports = HelperOrder;
