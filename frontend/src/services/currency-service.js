import { axios } from "../utils/axios-helper";

export class CurrencyService {
  static info(id) {
    return axios.get("/currency/info", { params: { id } });
  }
  static list() {
    return axios.get("/currency/list");
  }
}
