import Joi from "@hapi/joi";
import Koa from "koa";

import { AccountAddAndUpdateInput } from "../graphql/generated/graphql";
import {
  Controller,
  Delete,
  Get,
  JoiVerifyBody,
  JoiVerifyQuery,
  Post,
  Put,
} from "../lib/decorator-router";
import { AccountService } from "../services/account-service";

@Controller("/account")
export class AccountController {
  @Get("/list")
  static async accountList(ctx: Koa.Context) {
    ctx.body = await AccountService.list(ctx.getUserId());
  }

  @Get("/info")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  static async info(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = await AccountService.info(ctx.getUserId(), id);
  }

  @Post("/add")
  @JoiVerifyBody(
    Joi.object({
      name: Joi.string().required(),
      isDefault: Joi.boolean().required(),
      initialAmount: Joi.number().required(),
      currencyId: Joi.number().required(),
    })
  )
  static async addAccount(ctx: Koa.Context) {
    const value = ctx.request.body as AccountAddAndUpdateInput;
    ctx.body = await AccountService.add(ctx.getUserId(), value);
  }

  @Put("/modify")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().required(),
    })
  )
  @JoiVerifyBody(
    Joi.object({
      name: Joi.string().required(),
      isDefault: Joi.boolean().required(),
      initialAmount: Joi.number().required(),
      currencyId: Joi.number().required(),
    })
  )
  static async modifyAccount(ctx: Koa.Context) {
    const { id } = ctx.query;
    const value = ctx.request.body as AccountAddAndUpdateInput;
    ctx.body = { ok: await AccountService.modify(ctx.getUserId(), id, value) };
  }

  @Delete("/delete")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().required(),
    })
  )
  static async deleteAccount(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = { ok: await AccountService.delete(ctx.getUserId(), id) };
  }
}
