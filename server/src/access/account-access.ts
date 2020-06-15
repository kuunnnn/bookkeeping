import { DeleteResult, getManager, InsertResult, UpdateResult } from "typeorm";

import { TblAccount } from "../entity/tbl-account";
import { TblCurrency } from "../entity/tbl-currency";
import { AccountAddAndUpdateInput } from "../graphql/generated/graphql";

export interface AccountJoinCurrency {
  id: number;
  name: string;
  expenses: string;
  incomes: string;
  initialAmount: string;
  isDefault: number;
  userId: number;
  currencyId: number;
  currencyName: string;
  currencyCode: string;
  currencySymbol: string;
}

export class AccountAccess {
  static async list(userId: number): Promise<AccountJoinCurrency[]> {
    return getManager()
      .createQueryBuilder(TblAccount, "a")
      .innerJoinAndSelect(TblCurrency, "c", "c.id=a.currencyId")
      .where("a.userId=:uId", { uId: userId })
      .select("a.id", "id")
      .addSelect("a.name", "name")
      .addSelect("a.initialAmount", "initialAmount")
      .addSelect("a.expenses", "expenses")
      .addSelect("a.incomes", "incomes")
      .addSelect("a.isDefault", "isDefault")
      .addSelect("a.userId", "userId")
      .addSelect("a.currencyId", "currencyId")
      .addSelect("c.name", "currencyName")
      .addSelect("c.code", "currencyCode")
      .addSelect("c.symbol", "currencySymbol")
      .printSql()
      .getRawMany<AccountJoinCurrency>();
  }

  static async find(
    userId: number,
    id: number
  ): Promise<AccountJoinCurrency | undefined> {
    return getManager()
      .createQueryBuilder(TblAccount, "a")
      .innerJoinAndSelect(TblCurrency, "c", "c.id=a.currencyId")
      .where("a.userId=:uId", { uId: userId })
      .andWhere("a.id=:id", { id })
      .select("a.id", "id")
      .addSelect("a.name", "name")
      .addSelect("a.initialAmount", "initialAmount")
      .addSelect("a.expenses", "expenses")
      .addSelect("a.incomes", "incomes")
      .addSelect("a.isDefault", "isDefault")
      .addSelect("a.userId", "userId")
      .addSelect("a.currencyId", "currencyId")
      .addSelect("c.name", "currencyName")
      .addSelect("c.code", "currencyCode")
      .addSelect("c.symbol", "currencySymbol")
      .printSql()
      .getRawOne<AccountJoinCurrency>();
  }

  /**
   * 查询该用户是否已经使用过这个账户名了
   * @param userId
   * @param name
   */
  static findByName(
    userId: number,
    name: string
  ): Promise<TblAccount | undefined> {
    return getManager().findOne(TblAccount, {
      user: { id: userId },
      name,
    });
  }

  static async create(
    userId: number,
    data: AccountAddAndUpdateInput
  ): Promise<InsertResult> {
    return getManager().insert(TblAccount, {
      user: { id: userId },
      initialAmount: data.initialAmount,
      isDefault: data.isDefault,
      name: data.name,
      currency: { id: data.currencyId },
    });
  }

  static async update(
    userId: number,
    id: number,
    data: AccountAddAndUpdateInput
  ): Promise<UpdateResult> {
    if (data.isDefault) {
      await getManager().update(
        TblAccount,
        {
          isDefault: true,
          user: { id: userId },
        },
        {
          isDefault: false,
        }
      );
    }
    return getManager().update(
      TblAccount,
      { user: { id: userId }, id },
      {
        initialAmount: data.initialAmount,
        isDefault: data.isDefault,
        name: data.name,
        currency: { id: data.currencyId },
      }
    );
  }

  static async delete(userId: number, id: number): Promise<DeleteResult> {
    return getManager().delete(TblAccount, { id, user: { id: userId } });
  }
}
