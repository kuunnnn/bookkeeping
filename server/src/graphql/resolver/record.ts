import { IResolvers } from "graphql-tools";

import { InsertRecordData, RecordService } from "../../services/record-service";
import { Context } from "../context";
import {
  MutationCreateRecordArgs,
  MutationDeleteRecordArgs,
  MutationUpdateRecordArgs,
  QueryRecordArgs,
  QueryRecordListArgs,
} from "../generated/graphql";

const resolve: IResolvers = {
  Query: {
    record(_root, { id }: QueryRecordArgs, ctx: Context) {
      return RecordService.info(ctx.jwtData.userId, id);
    },
    recordList(_root, args: QueryRecordListArgs, ctx: Context) {
      return RecordService.list(ctx.jwtData.userId, (args.param || {}) as any);
    },
  },
  Mutation: {
    createRecord(_root, args: MutationCreateRecordArgs, ctx: Context) {
      return RecordService.add(
        ctx.jwtData.userId,
        args.data as InsertRecordData
      );
    },
    updateRecord(_root, args: MutationUpdateRecordArgs, ctx: Context) {
      return RecordService.modify(
        ctx.jwtData.userId,
        args.id,
        args.param as InsertRecordData
      ).then((ok) => ({ ok }));
    },
    deleteRecord(_root, args: MutationDeleteRecordArgs, ctx: Context) {
      return RecordService.delete(ctx.jwtData.userId, args.id).then((ok) => ({
        ok,
      }));
    },
  },
};
export default resolve;
