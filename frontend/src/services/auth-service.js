import { axios } from "../utils/axios-helper";
import { Hash } from "../utils/security/hash";
import { StorageHelper } from "../utils/storage-helper";
import { AES_CBC, ECDH } from "../utils/security/dh";

export class AuthService {
  /**
   *
   * @param phone
   * @return {Promise<boolean>}
   */
  static isRegister(phone) {
    return axios.post("/pub/phoneIsUsed", { phone }).then(res => res.isUsed);
  }

  /**
   * @param {string} phone
   * @param {string} password
   * @param isRegister
   */
  static async login(phone, password, isRegister = false) {
    const ecdh = new ECDH();
    const iv = AES_CBC.genRandomBytes();
    const { publicKey } = await axios.post("/pub/exchangeSecret", {
      phone,
      key: ecdh.getPublicKey()
    });
    const secret = ecdh.getSecret(publicKey);
    const { salt } = await axios.post("/pub/genSalt", {
      phone,
      iv: AES_CBC.bytesToHex(iv)
    });
    const decodeSalt = AES_CBC.hexToBytes(
      AES_CBC.decrypt(salt, AES_CBC.hexToBytes(secret), iv)
    );
    const cipher = Hash.bCryptHash(Hash.hmac_sha256(password), decodeSalt);
    const queryData = {
      phone,
      cipher: AES_CBC.encrypt(cipher, AES_CBC.hexToBytes(secret), iv)
    };
    if (isRegister) {
      return axios.post("/pub/register", queryData);
    } else {
      return axios.post("/pub/login", queryData);
    }
  }

  /**
   *
   * @param {string} phone
   * @param {string} password
   */
  static async register(phone, password) {
    return this.login(phone, password, true);
  }

  static tokenLogin() {
    return axios.post("/tokenLogin");
  }

  static async logout() {
    await axios.post("/logout");
    StorageHelper.clearToken();
  }

  static async refreshToken() {
    const response = await axios.post("/pub/refreshToken", {
      headers: {
        "X-REFRESH-TOKEN": StorageHelper.getToken().refresh_token
      }
    });
    console.log(response);
    StorageHelper.setToken();
  }
}
