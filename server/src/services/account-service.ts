import { getManager } from "typeorm";

import { AccountAccess, AccountJoinCurrency } from "../access/account-access";
import { Id } from "../constant/interface";
import { TblAccount } from "../entity/tbl-account";
import { AccountAddAndUpdateInput } from "../graphql/generated/graphql";
import { throwHttpError } from "../utils/error-helper";

export class AccountService {
  static async info(
    uId: number,
    id: number
  ): Promise<AccountJoinCurrency | undefined> {
    return AccountAccess.find(uId, id);
  }

  static async list(uId: number): Promise<AccountJoinCurrency[]> {
    return AccountAccess.list(uId);
  }

  static async add(uId: number, data: AccountAddAndUpdateInput): Promise<Id> {
    const account = await AccountAccess.findByName(uId, data.name);
    if (account) {
      throwHttpError("该账户已经存在", 400);
    }
    return AccountAccess.create(uId, data).then(
      (res) => res.identifiers[0]
    ) as Promise<Id>;
  }

  static async modify(
    uId: number,
    id: number,
    data: AccountAddAndUpdateInput
  ): Promise<boolean> {
    const isExist = await getManager()
      .createQueryBuilder(TblAccount, "a")
      .where("a.name=:name", { name: data.name })
      .andWhere("a.id!=:id", { id })
      .getOne();
    if (!isExist) {
      throwHttpError("账户已存在", 400);
    }
    return AccountAccess.update(uId, id, data).then(
      (res) => res.affected === 1
    );
  }

  static async delete(uId: number, id: number): Promise<boolean> {
    return AccountAccess.delete(uId, id).then((res) => res.affected === 1);
  }
}
