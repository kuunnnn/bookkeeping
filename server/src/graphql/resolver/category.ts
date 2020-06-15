import { IResolvers } from "graphql-tools";

import { CategoryService } from "../../services/category-service";
import { Context } from "../context";
import {
  MutationCreateCategoryArgs,
  MutationDeleteCategoryArgs,
  MutationUpdateCategoryArgs,
  QueryCategoryArgs,
  QueryCategoryListArgs,
} from "../generated/graphql";

const resolve: IResolvers = {
  Query: {
    category(_root, args: QueryCategoryArgs, ctx: Context) {
      return CategoryService.info(ctx.jwtData.userId, args.id);
    },
    categoryList(_root, args: QueryCategoryListArgs, ctx: Context) {
      return CategoryService.list(ctx.jwtData.userId, args.type);
    },
  },
  Mutation: {
    createCategory(_root, args: MutationCreateCategoryArgs, ctx: Context) {
      return CategoryService.add(ctx.jwtData.userId, args.data as any);
    },
    updateCategory(_root, args: MutationUpdateCategoryArgs, ctx: Context) {
      return CategoryService.modify(
        ctx.jwtData.userId,
        args.id,
        args.name
      ).then((ok) => ({ ok }));
    },
    deleteCategory(_root, { id }: MutationDeleteCategoryArgs, ctx: Context) {
      return CategoryService.delete(ctx.jwtData.userId, id).then((ok) => ({
        ok,
      }));
    },
  },
};
export default resolve;
