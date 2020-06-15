import { axios } from "../utils/axios-helper";

export class CategoryService {
  static info(id) {
    return axios.get("/category/info", { params: { id } });
  }

  static list() {
    return axios.get("/category/list");
  }

  static add(data) {
    return axios.post("/category/add", data);
  }

  static modify(id, data) {
    return axios.put("/category/modify?id=" + id, data);
  }

  static delete(id) {
    return axios.delete("/category/delete", { params: { id } });
  }
}
