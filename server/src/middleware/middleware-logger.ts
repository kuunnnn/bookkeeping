import Koa from "koa";
import pino from "pino";
import pinoHttp from "pino-http";

import {
  clsProxifyKoaMiddleware,
  defaultLogger,
  logger,
} from "../logger/logger";

export function loggerMiddleware(): Koa.Middleware {
  return function (ctx, next) {
    pinoHttp({
      logger: logger,
      serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
      genReqId: (req) => req.id,
    })(ctx.req, ctx.res);
    return next();
  };
}
// 让一个请求中无论在哪个方法中都能绑定一个请求 id
export function clsLoggerMiddleware(): Koa.Middleware {
  return clsProxifyKoaMiddleware("clsKeyLogger", (ctx) => {
    return defaultLogger.child({ requestId: ctx.state.rId });
  });
}
