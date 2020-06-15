import Joi from "@hapi/joi";
import Koa from "koa";

import {
  Controller,
  Delete,
  Get,
  JoiVerifyBody,
  JoiVerifyQuery,
  Post,
  Put,
} from "../lib/decorator-router";
import { CategoryService } from "../services/category-service";

@Controller("/category")
export class CategoryController {
  @Get("/list")
  @JoiVerifyQuery(
    Joi.object({
      type: Joi.string().regex(/^(income|expense)$/),
    })
  )
  static async categoryList(ctx: Koa.Context) {
    const { type } = ctx.query;
    ctx.body = await CategoryService.list(ctx.getUserId(), type);
  }

  @Get("/info")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().integer().required(),
    })
  )
  static async info(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = await CategoryService.info(ctx.getUserId(), id);
  }

  @Post("/add")
  @JoiVerifyBody(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string()
        .regex(/^(income|expense)$/)
        .required(),
    })
  )
  static async addCategory(ctx: Koa.Context) {
    const { type, name } = ctx.request.body;
    ctx.body = await CategoryService.add(ctx.getUserId(), { type, name });
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
    })
  )
  static async modifyCategory(ctx: Koa.Context) {
    const { id } = ctx.query;
    const { name } = ctx.request.body;
    ctx.body = { ok: await CategoryService.modify(ctx.getUserId(), id, name) };
  }

  @Delete("/delete")
  @JoiVerifyQuery(
    Joi.object({
      id: Joi.number().required(),
    })
  )
  static async deleteCategory(ctx: Koa.Context) {
    const { id } = ctx.query;
    ctx.body = { ok: await CategoryService.delete(ctx.getUserId(), id) };
  }
}
