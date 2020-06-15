import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";

import { Env } from "./config";
import { connectMysql } from "./connect/mysql";
import { server } from "./graphql/server";
import { logger } from "./logger/logger";
import { corsMiddleware } from "./middleware/middleware-cors";
import { handlerResult } from "./middleware/middleware-handler-result";
import { jwtMiddleware } from "./middleware/middleware-jwt";
import {
  clsLoggerMiddleware,
  loggerMiddleware,
} from "./middleware/middleware-logger";
import { requestContext } from "./middleware/middleware-request-context";
import { requestIdMiddleware } from "./middleware/middleware-request-id";
import { verifyParamMiddleware } from "./middleware/middleware-verify-param";
import { loadRouter } from "./router";

async function loadMiddleware(app: Koa) {
  const router = await loadRouter();
  app.use(corsMiddleware());
  app.use(requestIdMiddleware());
  app.use(bodyParser());
  app.use(clsLoggerMiddleware());
  app.use(loggerMiddleware());
  app.use(helmet());
  // graphql 的 api 在内部自己处理返回值和jwt
  // 前面已经添加过 cors 了 graphql 服务器可以不用添加了
  server.applyMiddleware({ app, cors: false });
  // graphql 外的接口统一处理返回值和 jwt 验证
  app.use(handlerResult());
  app.use(verifyParamMiddleware());
  app.use(jwtMiddleware());
  // 添加 uuid jwt 数据到 ctx.requestContext 属性上
  app.use(requestContext());
  app.use(router.routes());
  app.use(router.allowedMethods());
}

async function setup() {
  try {
    await connectMysql();
    const app = new Koa();
    await loadMiddleware(app);
    const port = Env.server_post;
    app.listen({ port: port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
    });
  } catch (e) {
    logger.fatal("setup error: %s", e.message);
    throw e;
  }
}

process.on("uncaughtException", async function (e) {
  logger.fatal("服务退出 error: %s", e.message);
  process.exit(1);
});

setup();
