import { getManager } from "typeorm";

import { TblAccount } from "../entity/tbl-account";
import { CategoryType, TblCategory } from "../entity/tbl-category";
import { TblRecord } from "../entity/tbl-record";

export interface RecordDescInfo extends TblRecord {
  categoryName: string;
  accountName: string;
  type: CategoryType;
}

export interface ListFilterParam {
  pageNum?: number;
  pageSize?: number;
}

export interface RecordFilterParam extends ListFilterParam {
  type?: "income" | "expense";
  year?: number;
  month?: number;
  day?: number;
  accountId?: number;
  categoryId?: number;
}

export class RecordAccess {
  static findRecordDesc(
    userId: number,
    id: number
  ): Promise<RecordDescInfo | undefined> {
    return getManager()
      .createQueryBuilder(TblRecord, "r")
      .innerJoinAndSelect(TblCategory, "c", "c.id=r.categoryId")
      .innerJoinAndSelect(TblAccount, "a", "a.id=r.accountId")
      .where("r.userId=:uId", { uId: userId })
      .andWhere("r.id=:id", { id })
      .select("r.id", "id")
      .addSelect("r.money", "money")
      .addSelect("r.remark", "remark")
      .addSelect("r.date", "date")
      .addSelect("r.userId", "userId")
      .addSelect("r.categoryId", "categoryId")
      .addSelect("r.accountId", "accountId")
      .addSelect("c.name", "categoryName")
      .addSelect("c.type", "type")
      .addSelect("a.name", "accountName")
      .printSql()
      .getRawOne<RecordDescInfo>();
  }

  static recordList(
    userId: number,
    filter: ListFilterParam
  ): Promise<RecordDescInfo[]> {
    const { pageSize = 10, pageNum = 0 } = filter;
    return getManager()
      .createQueryBuilder(TblRecord, "r")
      .innerJoinAndSelect(TblCategory, "c", "c.id=r.categoryId")
      .innerJoinAndSelect(TblAccount, "a", "a.id=r.accountId")
      .where("r.userId=:uId", { uId: userId })
      .select("r.id", "id")
      .addSelect("r.money", "money")
      .addSelect("r.remark", "remark")
      .addSelect("r.date", "date")
      .addSelect("r.userId", "userId")
      .addSelect("r.categoryId", "categoryId")
      .addSelect("r.accountId", "accountId")
      .addSelect("c.name", "categoryName")
      .addSelect("c.type", "type")
      .addSelect("a.name", "accountName")
      .skip(pageSize * pageNum)
      .take(pageSize)
      .printSql()
      .getRawMany<RecordDescInfo>();
  }

  static recordListByFilter(
    userId: number,
    filter: RecordFilterParam
  ): Promise<RecordDescInfo[]> {
    const {
      pageSize = 10,
      pageNum = 0,
      year,
      month,
      day,
      accountId,
      categoryId,
      type,
    } = filter;
    let whereString = "r.userId=:uId";
    const whereParam: any = { uId: userId };
    if (categoryId) {
      whereString = "r.categoryId=:categoryId";
      whereParam.categoryId = categoryId;
    }
    if (accountId) {
      whereString += " AND r.accountId=:accountId";
      whereParam.accountId = accountId;
    }
    if (type) {
      whereString += " AND c.type=:type";
      whereParam.type = type;
    }
    if (year) {
      whereString += " AND year(c.date)=:year";
      whereParam.year = year;
      if (month) {
        whereString += " AND month(c.date)=:month";
        whereParam.month = month;
      }
      if (day) {
        whereString += " AND day(c.date)=:day";
        whereParam.day = day;
      }
    }
    return getManager()
      .createQueryBuilder(TblRecord, "r")
      .innerJoinAndSelect(TblCategory, "c", "c.id=r.categoryId")
      .innerJoinAndSelect(TblAccount, "a", "a.id=r.accountId")
      .where(whereString, whereParam)
      .select("r.id", "id")
      .addSelect("r.money", "money")
      .addSelect("r.remark", "remark")
      .addSelect("r.date", "date")
      .addSelect("r.userId", "userId")
      .addSelect("r.categoryId", "categoryId")
      .addSelect("r.accountId", "accountId")
      .addSelect("c.name", "categoryName")
      .addSelect("c.type", "type")
      .addSelect("a.name", "accountName")
      .skip(pageSize * pageNum)
      .take(pageSize)
      .printSql()
      .getRawMany<RecordDescInfo>();
  }
}
