import Joi from "@hapi/joi";
import Koa from "koa";

import { RecordFilterParam } from "../access/record-access";
import {
  Controller,
  Delete,
  Get,
  JoiVerifyBody,
  JoiVerifyQuery,
  Post,
  Put,
} from "../lib/decorator-router";
import { InsertRecordData, RecordService } from "../services/record-service";

const recordBaseJoiSchema = Joi.object({
  money: Joi.number().min(0).required(),
  remark: Joi.string().max(120),
  type: Joi.string()
    .regex(/^(income|expense)$/)
    .required(),
  date: Joi.string().isoDate().required(),
  accountId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
});

@Controller("/record")
export class RecordController {
  @Post("/add")
  @JoiVerifyBody(recordBaseJoiSchema)
  static async addRecord(ctx: Koa.Context) {
    const param = ctx.request.body as InsertRecordData;
    ctx.body = await RecordService.add(ctx.getUserId(), param);
  }
  @Get("/info")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  static async info(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = await RecordService.info(ctx.getUserId(), id);
  }

  @Delete("/delete")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  static async deleteRecord(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = { ok: await RecordService.delete(ctx.getUserId(), id) };
  }

  @Put("/modify")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  @JoiVerifyBody(recordBaseJoiSchema)
  static async modifyRecord(ctx: Koa.Context) {
    const { id } = ctx.query;
    const param = ctx.request.body as InsertRecordData;
    ctx.body = { ok: await RecordService.modify(ctx.getUserId(), id, param) };
  }

  @Get("/list")
  @JoiVerifyQuery(
    Joi.object({
      pageNum: Joi.number().integer().min(0),
      pageSize: Joi.number().integer().min(10),
      type: Joi.string().regex(/^(income|expense)$/),
      year: Joi.number().integer().min(2000).max(2100),
      month: Joi.number().integer().min(1).max(12),
      day: Joi.number().integer().min(1).max(31),
      accountId: Joi.number().integer().min(1),
      categoryId: Joi.number().integer().min(1),
    })
  )
  static async recordList(ctx: Koa.Context) {
    const filterParam = ctx.query;
    ctx.body = await RecordService.list(ctx.getUserId(), filterParam);
  }
}
