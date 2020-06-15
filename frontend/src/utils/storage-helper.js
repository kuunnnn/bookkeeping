export class StorageHelper {
  static clearToken() {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("USER_REFRESH_TOKEN");
  }
  /**
   * 保存 token
   */
  static setToken(token, refresh_token) {
    localStorage.setItem("USER_TOKEN", token);
    localStorage.setItem("USER_REFRESH_TOKEN", refresh_token);
  }
  /**
   * @return {{refresh_token: string, access_token: string}}
   */
  static getToken() {
    return {
      access_token: localStorage.getItem("USER_TOKEN"),
      refresh_token: localStorage.getItem("USER_REFRESH_TOKEN")
    };
  }
  static deleteToken() {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("USER_REFRESH_TOKEN");
  }
}
