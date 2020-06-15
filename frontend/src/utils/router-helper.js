import router from "../router";

export class RouterHelper {
  static to(path, query = {}, replace = false) {
    let method = "push";
    if (replace) {
      method = "replace";
    }
    return router[method]({ path, query });
  }
}
