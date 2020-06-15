export class Utils {
  /**
   * @param { number }n
   * @return {string}
   */
  static fillZero(n) {
    return n < 10 ? `0${n}` : n.toString();
  }

  /**
   *
   * @param {number} num
   * @return {Promise<"ok">}
   */
  static sleep(num) {
    return new Promise(resolve => {
      setTimeout(() => resolve("ok"), num);
    });
  }
}
