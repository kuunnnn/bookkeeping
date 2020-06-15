import { DeleteResult, getManager, InsertResult, UpdateResult } from "typeorm";

import { CategoryType, TblCategory } from "../entity/tbl-category";

export class CategoryAccess {
  static async listAll(userId: number): Promise<TblCategory[]> {
    return getManager()
      .createQueryBuilder(TblCategory, "c")
      .where("c.userId=:id", { id: userId })
      .select("c.userId", "userId")
      .addSelect("c.type", "type")
      .addSelect("c.nums", "nums")
      .addSelect("c.name", "name")
      .addSelect("c.id", "id")
      .orderBy("nums", "DESC")
      .getRawMany();
  }

  static async listByType(
    userId: number,
    type: CategoryType
  ): Promise<TblCategory[]> {
    return getManager()
      .createQueryBuilder(TblCategory, "c")
      .where("c.userId=:id", { id: userId })
      .andWhere("c.type=:type", { type })
      .select("c.userId", "userId")
      .addSelect("c.type", "type")
      .addSelect("c.nums", "nums")
      .addSelect("c.name", "name")
      .addSelect("c.id", "id")
      .orderBy("nums", "DESC")
      .getRawMany<TblCategory>();
  }

  static userCategoryIsExistByName(
    userId: number,
    name: string
  ): Promise<TblCategory | undefined> {
    return getManager().findOne(TblCategory, { user: { id: userId }, name });
  }

  static async find(
    userId: number,
    id: number
  ): Promise<TblCategory | undefined> {
    return getManager()
      .createQueryBuilder(TblCategory, "c")
      .where("c.userId=:uId", { uId: userId })
      .andWhere("c.id=:id", { id })
      .select("c.userId", "userId")
      .addSelect("c.type", "type")
      .addSelect("c.nums", "nums")
      .addSelect("c.name", "name")
      .addSelect("c.id", "id")
      .orderBy("nums", "DESC")
      .getRawOne<TblCategory>();
  }

  static async create(
    userId: number,
    data: CategoryInsertAndUpdateData
  ): Promise<InsertResult> {
    return getManager().insert(TblCategory, {
      user: { id: userId },
      ...data,
      nums: 0,
    });
  }

  static async update(
    userId: number,
    id: number,
    name: string
  ): Promise<UpdateResult> {
    return getManager().update(
      TblCategory,
      { id, user: { id: userId } },
      { name }
    );
  }

  static async delete(userId: number, id: number): Promise<DeleteResult> {
    return getManager().delete(TblCategory, { id, user: { id: userId } });
  }
}

export interface CategoryInsertAndUpdateData {
  type: CategoryType;
  name: string;
}
