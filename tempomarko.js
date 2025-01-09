const OrderHandler = require('./common/orderHandler');
const OutputHandler = require('./common/outputHandler');
const UnitHandler = require('./common/unitHandler');
const KeywordHandler = require('./common/keywordHandler');
const { colt } = require('./lib/cols');
const CalculateAfterOrder = require('./afterOrder/calculateAfterOrder');

class Tempomarko {
  constructor() {

    this.orderHandler = new OrderHandler();
    this.keywordHandler = new KeywordHandler();
    this.unitHandler = new UnitHandler();
    this.outputHandler = new OutputHandler();

    this.calculateAfterOrder = new CalculateAfterOrder();
  }

  /**
   *
   *
   * @param {string[]} args
   * @returns
   *
   * @memberOf Tempomarko
   */
  run(args) {

    if (args.length === 0) {
      args = ['n'];
    }

    const willContinue = this.orderHandler.handleOrder(args[0], args.slice(1));
    if (!willContinue) {
      return;
    }

    const parsedArgs = this.keywordHandler.replace(args);

    const units = this.unitHandler.parseUnit(parsedArgs);

    if (this.calculateAfterOrder.run(units)) {
      colt(this.outputHandler.parse(units)).log();
    }
  }

  splitBy6(units) {

    const result = [];

    for (let i = 0; i < units.length; i = i + 6) {

      result.push(units.slice(i, i + 6).join(' '));
    }

    return result;
  }
}

module.exports = Tempomarko;
