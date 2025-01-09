let instance = null;

class LoggerHandler {
  constructor() { }

  print(message) {

    console.log();
    console.log(message);
    console.log();
  }

  /**
   *
   *
   * @static
   * @returns {LoggerHandler}
   *
   * @memberOf LoggerHandler
   */
  static getInstance() {

    if (instance === null) {
      instance = new LoggerHandler();
    }

    return instance;
  }
}

module.exports = LoggerHandler;
