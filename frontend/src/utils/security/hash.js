/**
 * @author: hukun
 * @Date: 2019-06-06 17:42
 * @description
 * hash 算法相关
 */
import bcryptjs from "bcryptjs";
import forge from "node-forge";

export class Hash {
  /**
   * 生成一个salt
   * @param saltRounds
   */
  static bCryptSalt(saltRounds = 10) {
    return bcryptjs.genSaltSync(saltRounds);
  }

  /**
   * 自动生成盐并返回hash
   * @param data
   * @param saltRounds
   */
  static bCryptHash(data, saltRounds = 10) {
    return bcryptjs.hashSync(data, saltRounds);
  }

  /**
   *
   * @param {string} text
   * @return {Buffer | string | PromiseLike<ArrayBuffer>}
   */
  static hmac_sha256(text) {
    const hmac = forge.hmac.create();
    hmac.start("sha256", text);
    return hmac.digest().toHex();
  }
}
