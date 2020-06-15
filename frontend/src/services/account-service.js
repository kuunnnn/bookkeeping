import { axios } from "../utils/axios-helper";

export class AccountService {
  static info(id) {
    return axios.get("/account/info", { params: { id } });
  }

  static list() {
    return axios.get("/account/list");
  }

  static add(data) {
    return axios.post("/account/add", data);
  }

  static modify(id, data) {
    return axios.put("/account/modify?id=" + id, data);
  }

  static delete(id) {
    return axios.delete("/account/delete", { params: { id } });
  }
}
