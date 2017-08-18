/*
 * https://github.com/arashm/JDate
 * @author: Arash Mousavi
 * @version: 1.0.0
 */

const Converter = require('./converter');
const helpers = require('./helpers');

class JDate {
  constructor(input) {
    this.input = input || new Date();
    this.date = this.toJalali(this.input);
  }

  /*
   * Coverts a Gregorian date to Jalali date
   *
   * @params {Date} date
   * @return {Array}
   */
  static toJalali(date) {
    const julianDate = Converter.g2d(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
    const jdate = Converter.d2j(julianDate);

    return [jdate.jy, jdate.jm, jdate.jd];
  }

  /*
   * converts a Jalali date to Gregorian
   *
   * @params {Number} year
   * @params {Number} month
   * @params {Number} day
   * @return {Date}
   */
  static toGregorian(year, month, day) {
    const gdate = Converter.d2g(Converter.j2d(year, month, day));

    return new Date(gdate.gy, gdate.gm - 1, gdate.gd);
  }

  /*
   * Checks if a given year is a leap year or not
   *
   * @params {Number} year
   * @return {Boolean}
   */
  static isLeapYear(year) {
    return Converter.jalCal(year).leap === 0;
  }

  /*
   * Returns month length
   *
   * @params {Number} year
   * @params {Number} month
   * @return {Number}
   */
  static daysInMonth(year, month) {
    let calcedYear = year - Math.floor(month / 12);
    let calcedMonth = month - (Math.floor(month / 12) * 12);

    if (calcedMonth < 0) {
      calcedMonth += 12;
      calcedYear -= 1;
    } else if (calcedMonth === 0) {
      calcedMonth = 12;
    }

    if (calcedMonth <= 6) {
      return 31;
    } else if (calcedMonth <= 11) {
      return 30;
    } else if (JDate.isLeapYear(calcedYear)) {
      return 30;
    }
    return 29;
  }

  /*
   * Converts JDate date to Gregorian
   */
  toGregorian() {
    return JDate.toGregorian(this.date[0], this.date[1], this.date[2]);
  }

  /*
   * Shows Jalali's full year, ex: 1393
   *
   * @return {Integer}
   */
  getFullYear() {
    return this.date[0];
  }

  /*
   * Sets the Jalali full year
   *
   * @params {Number} year
   * @return {JDate}
   */
  setFullYear(year) {
    this.date[0] = parseInt(year, 10);
    this.input = this.toGregorian();
    return this;
  }

  /*
   * Shows Jalali month number.
   *
   * @return {Number} Jalali month number
   */
  getMonth() {
    return this.date[1];
  }

  /*
   * Sets the Jalali month number. An integer between 0 and 11
   *
   * @params {Number} month
   * @returns {JDate}
   */
  setMonth(month) {
    const fixed = helpers.fixMonth(this.getFullYear(), parseInt(month, 10));
    this.date[0] = fixed[0];
    this.date[1] = fixed[1];
    this.input = this.toGregorian();

    return this;
  }

  /*
   * Shows Jalali day number. A number between 0 to 31
   *
   * @return {Number} Jalali day number
   */
  getDate() {
    return this.date[2];
  }

  /*
   * Sets Jalali day number. A number between 0 to 31
   *
   * @params {Number} date
   * @return {JDate}
   */
  setDate(date) {
    this.date[2] = parseInt(date, 10);
    this.input = this.toGregorian();

    return this;
  }

  /*
   * Returns the day of the week for the specified date. A number between 0 to 6
   *
   * @returns {Number}
   */
  getDay() {
    return this.input.getDay();
  }

  /*
   * Returns a formated output of current date
   *
   * @params {String} format
   * @return {String}
   */
  format(format) {
    let result = helpers.replaceYear(format, this);
    result = helpers.replaceMonth(result, this);
    result = helpers.replaceDay(result, this);

    return result;
  }
}

module.exports = JDate;
