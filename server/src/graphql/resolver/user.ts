import { IResolvers } from "graphql-tools";

import { UserService } from "../../services/user-service";
import { Context } from "../context";
import { MutationUpdateUserNameArgs } from "../generated/graphql";

const resolve: IResolvers = {
  Query: {
    user(_root, args, ctx: Context) {
      return UserService.info(ctx.jwtData.userId);
    },
  },
  Mutation: {
    updateUserName(_root, { name }: MutationUpdateUserNameArgs, ctx: Context) {
      return UserService.modifyUserName(
        ctx.jwtData.userId,
        name
      ).then((ok) => ({ ok }));
    },
  },
};
export default resolve;
