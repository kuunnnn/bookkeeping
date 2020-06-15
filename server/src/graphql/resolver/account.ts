import { IResolvers } from "graphql-tools";

import { AccountService } from "../../services/account-service";
import { Context } from "../context";
import {
  MutationCreateAccountArgs,
  MutationDeleteAccountArgs,
  MutationUpdateAccountArgs,
  QueryAccountArgs,
} from "../generated/graphql";

const resolve: IResolvers = {
  Query: {
    account(_root, { id }: QueryAccountArgs, ctx: Context) {
      return AccountService.info(ctx.jwtData.userId, id);
    },
    accountList(_root, args, ctx: Context) {
      return AccountService.list(ctx.jwtData.userId);
    },
  },
  Mutation: {
    createAccount(_root, { data }: MutationCreateAccountArgs, ctx: Context) {
      return AccountService.add(ctx.jwtData.userId, data);
    },
    updateAccount(_root, args: MutationUpdateAccountArgs, ctx: Context) {
      return AccountService.modify(
        ctx.jwtData.userId,
        args.id,
        args.param
      ).then((ok) => ({ ok }));
    },
    deleteAccount(_root, { id }: MutationDeleteAccountArgs, ctx: Context) {
      return AccountService.delete(ctx.jwtData.userId, id).then((ok) => ({
        ok,
      }));
    },
  },
};
export default resolve;
