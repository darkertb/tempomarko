const CommonUseOrder = require('../order/commonUseOrder');
const HelperOrder = require('../order/helperOrder');
const TimezoneOrder = require('../order/timezoneOrder');

const orderHandlers = [
  new TimezoneOrder(),
  new HelperOrder(),
  new CommonUseOrder(),
];

class OrderHandler {
  constructor() {

    /** @type {import('../order/orderEntity')[]} */
    this.orders = [];

    for (const orderHandler of orderHandlers) {
      this.orders.push(...orderHandler.getOrderList());
    }
  }

  handleOrder(arg, otherArgs) {

    let _arg = arg;
    let _otherArgs = otherArgs;

    if (['.'].includes(arg[0])) {
      _arg = arg[0];
      _otherArgs = [arg.slice(1)];
    }

    const order = this.orders.find((order) => {
      if (Array.isArray(order.keyword)) {
        return order.keyword.includes(_arg);
      }
      else {
        return order.keyword === _arg;
      }
    });

    if (order === undefined) {
      return true;
    }

    order.func({
      otherArgs: _otherArgs,
      orderHandlers: orderHandlers,
    });

    return false;
  }
}

module.exports = OrderHandler;
