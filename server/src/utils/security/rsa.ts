/**
 * @author: hukun
 * @Date: 2019-06-06 17:42
 * @description
 * RSA 算法相关
 */
import NodeRSA from "node-rsa";

class ProxyRsa {
  private key: NodeRSA;

  /**
   *
   * @param {NodeRSA} rsa
   */
  constructor(rsa: NodeRSA) {
    this.key = rsa;
  }

  /**
   * 获取公钥
   * @return {string}
   */
  getPublicDer() {
    return this.key.exportKey("pkcs8-public-pem");
  }

  /**
   * 获取私钥
   * @return {string}
   */
  getPrivateDer() {
    return this.key.exportKey("pkcs8-private-pem");
  }

  /**
   * 用私钥加密
   * @param {string} data
   * @return {string}
   */
  encrypt(data: string) {
    return this.key.encryptPrivate(Buffer.from(data), "base64", "utf8");
  }

  /**
   * 用公钥加密
   * @param {string} data
   * @return {string}
   */
  encryptByPublicKey(data: string) {
    return this.key.encrypt(Buffer.from(data), "base64", "utf8");
  }

  /**
   * 用私钥解密
   * @param {string} data
   * @return {string}
   */
  decrypt(data: string) {
    return this.key.decrypt(data, "utf8");
  }

  /**
   * 用公钥解密
   * @param {string} data
   * @return {string}
   */
  decryptByPrivateKey(data: string) {
    return this.key.decryptPublic(data, "utf8");
  }

  /**
   * 签名
   * @param {string} text
   * @return {string}
   */
  sing(text: string) {
    this.key.sign(Buffer.from(text), "base64", "utf8");
  }

  /**
   * 验证签名
   * @param {string} text
   * @param {string} signature
   * @return {boolean}
   */
  verify(text: string, signature: string): boolean {
    return this.key.verify(Buffer.from(text), signature, "utf8", "base64");
  }
}

export const RSA = {
  /**
   * @param {number} size
   */
  new(size = 512): ProxyRsa {
    const key = new NodeRSA({ b: size });
    key.setOptions({ encryptionScheme: "pkcs1" });
    return new ProxyRsa(key);
  },

  /**
   *  导入公钥
   * @param {string} publicPem
   * @return {string}
   */
  importPublicKey(publicPem: string) {
    const key = new NodeRSA(publicPem, "pkcs8-public-pem");
    key.setOptions({ encryptionScheme: "pkcs1" });
    return new ProxyRsa(key);
  },
  /**
   * 导入私钥
   * @param {string} privatePem
   * @return {string}
   */
  importPrivateKey(privatePem: string) {
    const key = new NodeRSA(privatePem, "pkcs8-private-pem");
    key.setOptions({ encryptionScheme: "pkcs1" });
    return new ProxyRsa(key);
  },
};
