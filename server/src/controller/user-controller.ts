import Joi from "@hapi/joi";
import Koa from "koa";

import { Controller, Get, JoiVerifyBody, Put } from "../lib/decorator-router";
import { UserService } from "../services/user-service";

@Controller("/user")
export class UserController {
  @Put("/modify/name")
  @JoiVerifyBody(
    Joi.object({
      name: Joi.string().min(1).max(10).required(),
    })
  )
  static async modifyName(ctx: Koa.Context) {
    const { name } = ctx.request.body;
    ctx.body = {
      ok: await UserService.modifyUserName(ctx.getUserId(), name),
    };
  }

  @Get("/info")
  static async info(ctx: Koa.Context) {
    ctx.body = await UserService.info(ctx.getUserId());
  }
}
