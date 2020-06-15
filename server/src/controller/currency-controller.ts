import Joi from "@hapi/joi";
import Koa from "koa";

import { CurrencyAccess } from "../access/currency-access";
import { Controller, Get, JoiVerifyQuery } from "../lib/decorator-router";

@Controller("/currency")
export class CurrencyController {
  @Get("/list")
  static async currencyList(ctx: Koa.Context) {
    ctx.body = await CurrencyAccess.list();
  }

  @Get("/info")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  static async info(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = await CurrencyAccess.info(id);
  }
}
