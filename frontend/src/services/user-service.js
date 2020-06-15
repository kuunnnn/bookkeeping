import { axios } from "../utils/axios-helper";

export class UserService {
  static info() {
    return axios.get("/user/info");
  }

  static modifyName(name) {
    return axios.put("/user/modify/name", { name });
  }
}
