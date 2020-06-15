import * as Joi from "@hapi/joi";
import Koa from "koa";

import { JwtHelper } from "../utils/jwt-helper";

declare module "koa" {
  interface ExtendableContext {
    verifyBody: <T>(schema: Joi.Schema) => T;
    verifyQuery: <T>(schema: Joi.Schema) => T;
  }
}

// 添加校验参数方法
export function verifyParamMiddleware(): Koa.Middleware {
  return async function verifyParams(ctx: Koa.Context, next) {
    ctx.verifyBody = function <T>(schema: Joi.Schema): T {
      return verify<T>(ctx, schema, ctx.request.body);
    };
    ctx.verifyQuery = function <T>(schema: Joi.Schema): T {
      return verify<T>(ctx, schema, ctx.query);
    };
    return next();
  };
}

function verify<T>(ctx: Koa.Context, schema: Joi.Schema, value: T): T | never {
  const result = schema.validate(value || {});
  if (result.error !== undefined) {
    ctx.throw(400, result.error.message);
  }
  return result.value;
}
