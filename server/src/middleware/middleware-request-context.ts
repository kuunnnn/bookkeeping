import Koa from "koa";

import { OriginalJwtPayload } from "../utils/jwt-helper";

interface KoaState {
  user: OriginalJwtPayload;
  token: string;
  rId: string;
}

interface RequestContext {
  jwt: OriginalJwtPayload;
  token: string;
  requestId: string;
}

declare module "koa" {
  interface ExtendableContext {
    getUserId: () => number;
    state: KoaState;
    requestContext: RequestContext;
  }
}

// 添加校验参数方法
export function requestContext(): Koa.Middleware {
  return async function requestContextMiddleware(ctx: Koa.Context, next) {
    ctx.getUserId = function (): number {
      return ctx.state.user.userId;
    };
    ctx.requestContext = {
      jwt: ctx.state.user,
      token: ctx.state.token,
      requestId: ctx.state.rId,
    };
    return next();
  };
}
