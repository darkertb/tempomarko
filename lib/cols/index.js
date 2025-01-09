const themes = require('./themes');

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
const RESET_COLOR = '\x1b[39m';
const RESET_BACKGROUND_COLOR = '\x1b[49m';
const regExpResetColor = new RegExp(RESET_COLOR.replace(matchOperatorsRe, '\\$&'), 'g');
const regExpResetBgColor = new RegExp(RESET_BACKGROUND_COLOR.replace(matchOperatorsRe, '\\$&'), 'g');

/**
 * Cols is a class that allows you to colorize your console output.
 * Cols是一個允許你給控制檯輸出著色的類。
 *
 * @example new Cols('Hello World').red().t();
 *
 * @class Cols
 */
class Cols {
  constructor(text) {

    this._text = text;
  }

  static get themes() {
    return themes;
  }

  /**
   * Creates an instance of Cols.
   * 創建一個Cols的實例。Cols是一個允許你給控制檯輸出著色的類。
   * @example colt('Hello World').red().t();
   *
   * @static
   * @param {string|Cols} source
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  static colt(source) {

    return new Cols(typeof source === 'string' ? source : source.toString());
  }

  static _handleMultipleColors(myColor, text) {

    if (text.indexOf(RESET_COLOR) !== -1) {
      return text.replace(regExpResetColor, myColor);
    }

    return text;
  }

  static _handleMultipleColorsBackground(myColor, text) {

    if (text.indexOf(RESET_BACKGROUND_COLOR) !== -1) {
      return text.replace(regExpResetBgColor, myColor);
    }

    return text;
  }

  /**
   * Converts a hex color to rgb.
   * 將十六進制顏色轉換為rgb。
   *
   * @example Cols._hexToRgb('#000000');
   *
   * @static
   * @param {string} hex
   * @returns {{r: number, g: number, b: number}} rgb
   * @throws {Error} Invalid hex color format
   *
   * @memberOf Cols
   */
  static _hexToRgb(hex) {

    if (hex[0] !== '#' || (hex.length !== 4 && hex.length !== 7)) {
      throw new Error('Invalid hex color format');
    }

    const value = hex.length === 4
      ? parseInt(hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3], 16)
      : parseInt(hex.slice(1), 16);

    const rgb = {
      r: (value >> 16) & 0xFF,
      g: (value >> 8) & 0xFF,
      b: value & 0xFF,
    };

    return rgb;
  }

  /**
   * Returns the text.
   * 返回文本。
   *
   * @returns {string}
   *
   * @memberOf Cols
   */
  t() {
    return this._text;
  }

  log(withSpace=true) {

    if (withSpace) {
      console.log();
    }
    console.log(this._text);
    if (withSpace) {
      console.log();
    }
  }

  /**
   * Returns the text.
   * 返回文本。
   *
   * @returns {string}
   *
   * @memberOf Cols
   */
  toString() {

    return this._text;
  }

  bold() {

    this._text = `\x1b[1m${this._text}\x1b[22m`;
    return this;
  }

  italic() {

    this._text = `\x1b[3m${this._text}\x1b[23m`;
    return this;
  }

  underline() {

    this._text = `\x1b[4m${this._text}\x1b[24m`;
    return this;
  }

  blink() {

    this._text = `\x1b[5m${this._text}\x1b[25m`;
    return this;
  }

  inverse() {

    this._text = `\x1b[7m${this._text}\x1b[27m`;
    return this;
  }

  hidden() {

    this._text = `\x1b[8m${this._text}\x1b[28m`;
    return this;
  }

  strikethrough() {

    this._text = `\x1b[9m${this._text}\x1b[29m`;
    return this;
  }

  color256(index) {

    const colorCode = `\x1b[38;5;${index}m`;
    this._text = Cols._handleMultipleColors(colorCode, this._text);
    this._text = `${colorCode}${this._text}\x1b[39m`;
    return this;
  }

  bgColor256(index) {

    const colorCode = `\x1b[48;5;${index}m`;
    this._text = Cols._handleMultipleColorsBackground(colorCode, this._text);
    this._text = `${colorCode}${this._text}\x1b[49m`;
    return this;
  }

  /**
   * Set rgb color.
   *
   * @example colt('Hello World').rgb(255, 0, 0).t();
   *
   * @param {number} r 0-255
   * @param {number} g 0-255
   * @param {number} b 0-255
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  rgb(r, g, b) {

    const colorCode = `\x1b[38;2;${r};${g};${b}m`;
    this._text = Cols._handleMultipleColors(colorCode, this._text);
    this._text = `${colorCode}${this._text}${RESET_COLOR}`;
    return this;
  }

  /**
   * Set background rgb color.
   *
   * @example colt('Hello World').bgRGB(255, 0, 0).t();
   *
   * @param {number} r 0-255
   * @param {number} g 0-255
   * @param {number} b 0-255
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgRGB(r, g, b) {

    const colorCode = `\x1b[48;2;${r};${g};${b}m`;
    this._text = Cols._handleMultipleColorsBackground(colorCode, this._text);
    this._text = `${colorCode}${this._text}${RESET_BACKGROUND_COLOR}}`;
    return this;
  }

  /**
   * Set hex color.
   *
   * @example colt('Hello World').hex('#FF0000').t();
   * @example colt('Hello World').hex(colors.material.red).t();
   *
   * @param {string} hex #000000-#FFFFFF
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  hex(hex) {

    const rgb = Cols._hexToRgb(hex);
    const colorCode = `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
    this._text = Cols._handleMultipleColors(colorCode, this._text);

    this._text = `${colorCode}${this._text}${RESET_COLOR}`;
    return this;
  }

  /**
   * Set background hex color.
   *
   * @example colt('Hello World').bgHex('#FF0000').t();
   *
   * @param {string} hex #000000-#FFFFFF
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgHex(hex) {

    const rgb = Cols._hexToRgb(hex);
    const colorCode = `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
    this._text = Cols._handleMultipleColorsBackground(colorCode, this._text);

    this._text = `${colorCode}${this._text}${RESET_BACKGROUND_COLOR}`;
    return this;
  }

  /**
   * Set black color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  black() {

    this._text = Cols._handleMultipleColors('\x1b[30m', this._text);
    this._text = '\x1b[30m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set red color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  red() {

    this._text = Cols._handleMultipleColors('\x1b[31m', this._text);
    this._text = '\x1b[31m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set green color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  green() {

    this._text = Cols._handleMultipleColors('\x1b[32m', this._text);
    this._text = '\x1b[32m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set yellow color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  yellow() {

    this._text = Cols._handleMultipleColors('\x1b[33m', this._text);
    this._text = '\x1b[33m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set blue color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  blue() {

    this._text = Cols._handleMultipleColors('\x1b[34m', this._text);
    this._text = '\x1b[34m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set magenta color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  magenta() {

    this._text = Cols._handleMultipleColors('\x1b[35m', this._text);
    this._text = '\x1b[35m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set cyan color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  cyan() {

    this._text = Cols._handleMultipleColors('\x1b[36m', this._text);
    this._text = '\x1b[36m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set white color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  white() {

    this._text = Cols._handleMultipleColors('\x1b[37m', this._text);
    this._text = '\x1b[37m' + this._text + RESET_COLOR;
    return this;
  }

  /**
   * Set background black color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgBlack() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[40m', this._text);
    this._text = '\x1b[40m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background red color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgRed() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[41m', this._text);
    this._text = '\x1b[41m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background green color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgGreen() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[42m', this._text);
    this._text = '\x1b[42m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background yellow color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgYellow() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[43m', this._text);
    this._text = '\x1b[43m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background blue color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgBlue() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[44m', this._text);
    this._text = '\x1b[44m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background magenta color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgMagenta() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[45m', this._text);
    this._text = '\x1b[45m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background cyan color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgCyan() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[46m', this._text);
    this._text = '\x1b[46m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }

  /**
   * Set background white color.
   *
   * @returns {Cols}
   *
   * @memberOf Cols
   */
  bgWhite() {

    this._text = Cols._handleMultipleColorsBackground('\x1b[47m', this._text);
    this._text = '\x1b[47m' + this._text + RESET_BACKGROUND_COLOR;
    return this;
  }
}

module.exports = Cols;
