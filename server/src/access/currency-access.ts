import { getManager } from "typeorm";

import { TblCurrency } from "../entity/tbl-currency";

export class CurrencyAccess {
  static list(): Promise<TblCurrency[]> {
    return getManager().find(TblCurrency);
  }

  static info(id: number): Promise<TblCurrency | undefined> {
    return getManager().findOne(TblCurrency, { id });
  }
}
