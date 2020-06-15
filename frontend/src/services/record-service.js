import { axios } from "../utils/axios-helper";

export class RecordService {
  static info(id) {
    return axios.get("/record/info", { params: { id } });
  }

  static list() {
    return axios.get("/record/list");
  }

  static add(data) {
    return axios.post("/record/add", data);
  }

  static modify(id, data) {
    return axios.put("/record/modify?id=" + id, data);
  }

  static delete(id) {
    return axios.delete("/record/delete", { params: { id } });
  }
}
