import Joi from "@hapi/joi";
import { getManager } from "typeorm";

import {
  RecordAccess,
  RecordDescInfo,
  RecordFilterParam,
} from "../access/record-access";
import { Id } from "../constant/interface";
import { TblAccount } from "../entity/tbl-account";
import { TblCategory } from "../entity/tbl-category";
import { TblRecord } from "../entity/tbl-record";
import { RecordAddAndUpdateInput } from "../graphql/generated/graphql";
import { logger } from "../logger/logger";
import { throwHttpError } from "../utils/error-helper";

function verify<T>(data: T, schema: Joi.Schema): T {
  const result = schema.validate(data);
  if (result.error !== null) {
    logger.info(result);
    throwHttpError("validate error!", 400);
  }
  return result.value;
}

export interface InsertRecordData {
  money: number;
  remark?: string;
  type: "expense" | "income";
  date?: string;
  accountId: number;
  categoryId: number;
}

export class RecordService {
  static info(uId: number, id: number): Promise<RecordDescInfo | undefined> {
    return RecordAccess.findRecordDesc(uId, id);
  }

  static async modify(
    uId: number,
    id: number,
    param: InsertRecordData
  ): Promise<boolean> {
    const { money, remark = "", date, accountId, categoryId, type } = param;
    const record = await RecordAccess.findRecordDesc(uId, id);
    if (!record) {
      throwHttpError("无效的 id", 400);
    }
    return getManager().transaction(async (tx) => {
      const incrementKey = type === "income" ? "incomes" : "expenses";
      if (accountId !== record.accountId) {
        await tx.decrement(
          TblAccount,
          { id: record.accountId },
          incrementKey,
          money
        );
      } else {
        await tx.decrement(
          TblAccount,
          { id: accountId },
          incrementKey,
          record.money - money
        );
      }
      if (categoryId !== record.categoryId) {
        await tx.decrement(TblCategory, { id: categoryId }, "nums", 1);
      }
      return tx
        .update(
          TblRecord,
          { id },
          {
            money,
            remark,
            date,
            user: { id: uId },
            account: { id: accountId },
            category: { id: categoryId },
          }
        )
        .then((res) => res.affected === 1);
    });
  }

  static async add(uId: number, data: InsertRecordData): Promise<Id> {
    const { money, remark = "", date, accountId, categoryId, type } = data;
    return getManager().transaction(async (tx) => {
      await tx.increment(TblCategory, { id: categoryId }, "nums", 1);
      const incrementKey = type === "income" ? "incomes" : "expenses";
      await tx.increment(TblAccount, { id: accountId }, incrementKey, money);
      return tx
        .insert(TblRecord, {
          money,
          remark: remark as string,
          date,
          user: { id: uId },
          account: { id: accountId },
          category: { id: categoryId },
        })
        .then((res) => res.identifiers[0]);
    }) as Promise<Id>;
  }

  static async delete(uId: number, id: number): Promise<boolean> {
    const record = await RecordAccess.findRecordDesc(uId, id);
    if (!record) {
      throwHttpError("无效的 id", 400);
    }
    return await getManager().transaction(async (tx) => {
      const incrementKey = record.type === "income" ? "incomes" : "expenses";
      await tx.decrement(
        TblAccount,
        { id: record.accountId },
        incrementKey,
        record.money
      );
      return tx.delete(TblRecord, { id }).then((res) => res.affected === 1);
    });
  }

  static list(
    uId: number,
    filter: RecordFilterParam
  ): Promise<RecordDescInfo[]> {
    return RecordAccess.recordListByFilter(uId, filter);
  }
}
