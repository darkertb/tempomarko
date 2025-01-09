class NumberUtil {
  constructor() { }

  static isNumber(source) {

    const num = Number(source);

    return !isNaN(num);
  }
}

module.exports = NumberUtil;
