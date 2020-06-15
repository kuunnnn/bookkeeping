/**
 * @author: hukun
 * @Date: 2019-06-06 17:42
 * @description
 * hash 算法相关
 */
import bcryptjs from "bcryptjs";
import forge from "node-forge";

export class Bcrypt {
  /**
   * 生成一个salt
   * @param {number} saltRounds
   * @return {string}
   */
  static genBcryptSalt(saltRounds = 10): string {
    return bcryptjs.genSaltSync(saltRounds);
  }

  /**
   * 自动生成盐并返回hash
   * @param {string} data
   * @param {string|number} saltRounds
   * @return {string}
   */
  static genBcryptHash(data: string, saltRounds: number | string = 10): string {
    return bcryptjs.hashSync(data, saltRounds);
  }

  /**
   * 恒定时间的比较算法
   * @param {string} cipher1
   * @param {string} cipher2
   * @return {Boolean}
   */
  static safeStringCompare(cipher1: string, cipher2: string): boolean {
    let right = 0;
    let wrong = 0;
    for (let i = 0, k = cipher1.length; i < k; ++i) {
      if (cipher1.charCodeAt(i) === cipher2.charCodeAt(i)) {
        ++right;
      } else {
        ++wrong;
      }
    }
    return wrong === 0;
  }

  static HMAC_SHA256(text: string): string {
    const hmac = forge.hmac.create();
    hmac.start("sha256", text);
    return hmac.digest().toHex();
  }

  static SHA256(text: string): string {
    const md = forge.md.sha256.create();
    return md.update(text).digest().toHex();
  }
}
