import {
  CategoryAccess,
  CategoryInsertAndUpdateData,
} from "../access/category-access";
import { CategoryType, TblCategory } from "../entity/tbl-category";
import { throwHttpError } from "../utils/error-helper";

export class CategoryService {
  static list(uId: number, type?: string) {
    if (typeof type === "string") {
      return CategoryAccess.listByType(uId, type as CategoryType);
    }
    return CategoryAccess.listAll(uId);
  }

  static info(uId: number, id: number): Promise<TblCategory | undefined> {
    return CategoryAccess.find(uId, id);
  }

  static async add(
    uId: number,
    data: CategoryInsertAndUpdateData
  ): Promise<{ id: number }> {
    if (await CategoryService.isExistByName(uId, data.name)) {
      throwHttpError("该类别已经存在", 400);
    }
    return CategoryAccess.create(uId, data).then(
      (res) => res.identifiers[0]
    ) as Promise<{ id: number }>;
  }

  static isExistByName(uId: number, name: string): Promise<boolean> {
    return CategoryAccess.userCategoryIsExistByName(uId, name).then(
      (res) => !!res
    );
  }

  static async modify(uId: number, id: number, name: string): Promise<boolean> {
    if (await CategoryService.isExistByName(uId, name)) {
      throwHttpError("该类别已经存在", 400);
    }
    return CategoryAccess.update(uId, id, name).then(
      (res) => res.affected === 1
    );
  }

  static delete(uId: number, id: number): Promise<boolean> {
    return CategoryAccess.delete(uId, id).then((res) => res.affected === 1);
  }
}
