import { DeleteResult, getManager, InsertResult, UpdateResult } from "typeorm";

import { TblUser } from "../entity/tbl-user";

export class UserAccess {
  static async create(userData: TblUser): Promise<InsertResult> {
    return getManager().insert(TblUser, {
      password: userData.password,
      salt: userData.salt,
      avatar: userData.avatar,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    });
  }

  static async findByPhone(phone: string): Promise<TblUser | undefined> {
    return getManager().findOne(TblUser, { phone });
  }

  static async findById(id: number): Promise<TblUser | undefined> {
    return getManager().findOne(TblUser, id);
  }

  static async updateUserName(id: number, name: string): Promise<UpdateResult> {
    return getManager().update(TblUser, { id }, { name });
  }

  static async delete(phone: string): Promise<DeleteResult> {
    return getManager().delete(TblUser, { phone });
  }
}
