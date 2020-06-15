import Koa from "koa";
import { v4 } from "uuid";

import { requestHeaderId } from "../constant/constant";

export function requestIdMiddleware(): Koa.Middleware {
  return function (ctx, next) {
    const rId = v4();
    ctx.set(requestHeaderId, rId);
    ctx.req.id = rId;
    ctx.state.rId = rId;
    return next();
  };
}
