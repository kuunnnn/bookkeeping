import Koa from "koa";

// 参考  koa-json-error  和 koa-jwt
// 集中处理 api 的错误和响应
export function handlerResult(): Koa.Middleware {
  return async function handlerResultMiddleware(ctx: Koa.Context, next) {
    const shouldEmitError = (err: any, status: number) => {
      return !err.expose && status >= 500;
    };
    const shouldThrow404 = (status: number, body: any) => {
      return !status || (status === 404 && body == null);
    };
    try {
      const result = await next();
      shouldThrow404(ctx.status, ctx.body) && ctx.throw(404);
      ctx.body = { data: ctx.body, code: 200 };
      return Promise.resolve(result);
    } catch (err) {
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = {
          // message: 'Protected resource, use Authorization header to get access\n',
          message: err.originalError ? err.originalError.message : err.message,
          code: 401,
        };
      } else {
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = { message: err.message, code: ctx.status };
        // Emit the error if we really care
        shouldEmitError(err, ctx.status) && ctx.app.emit("error", err, ctx);
      }
    }
  };
}
