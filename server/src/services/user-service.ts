import { getManager } from "typeorm";

import { TblUser } from "../entity/tbl-user";

export class UserService {
  static async modifyUserName(id: number, name: string): Promise<boolean> {
    const result = await getManager().update(TblUser, { id }, { name });
    return result.affected === 1;
  }

  static info(id: number): Promise<TblUser | undefined> {
    return getManager().findOne(TblUser, { id });
  }
}
