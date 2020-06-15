import { IResolvers } from "graphql-tools";

import { AccountService } from "../../services/account-service";
import { CategoryService } from "../../services/category-service";
import { CurrencyService } from "../../services/currency-service";
import { RecordService } from "../../services/record-service";
import { UserService } from "../../services/user-service";
import { Context } from "../context";
import { QueryCurrencyArgs } from "../generated/graphql";
import accountResolver from "./account";
import categoryResolver from "./category";
import recordResolver from "./record";
import userResolver from "./user";

export const resolvers: IResolvers = {
  // @ts-ignore
  Query: {
    ...categoryResolver.Query,
    ...accountResolver.Query,
    ...recordResolver.Query,
    ...userResolver.Query,
    currency(_, args: QueryCurrencyArgs, ctx: Context) {
      return CurrencyService.info(args.id);
    },
    currencyList(_, args, ctx: Context) {
      return CurrencyService.list();
    },
  },
  Record: {
    user(parent, args, ctx: Context) {
      return UserService.info(parent.userId);
    },
    category(parent, args, ctx: Context) {
      return CategoryService.info(ctx.jwtData.userId, parent.categoryId);
    },
    account(parent, args, ctx: Context) {
      return AccountService.info(ctx.jwtData.userId, parent.accountId);
    },
  },
  Account: {
    user(parent, args, ctx: Context) {
      return UserService.info(parent.userId);
    },
    currency(parent, args, ctx: Context) {
      return CurrencyService.info(parent.currencyId);
    },
    recordList(parent, args, ctx: Context) {
      return RecordService.list(ctx.jwtData.userId, { accountId: parent.id });
    },
  },
  Category: {
    user(parent, args, ctx: Context) {
      return UserService.info(parent.userId);
    },
    recordList(parent, args, ctx: Context) {
      return RecordService.list(ctx.jwtData.userId, { categoryId: parent.id });
    },
  },
  // @ts-ignore
  Mutation: {
    ...categoryResolver.Mutation,
    ...userResolver.Mutation,
    ...recordResolver.Mutation,
    ...accountResolver.Mutation,
  },
};
