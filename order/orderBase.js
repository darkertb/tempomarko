class OrderBase {
  constructor() {

    /** @type {import('./orderEntity')[]} */
    this.orderList = [];
  }
}

module.exports = OrderBase;

/**
 * @typedef {Object} OrderActionParameters
 * @property {string[]} otherArgs
 * @property {OrderBase[]} orderHandlers
 */
