import {
  AuthenticationError,
  toApolloError,
  UserInputError,
} from "apollo-server-koa";

import { Env } from "../config";
import { logger } from "../logger/logger";
import { JwtHelper, JwtPayload } from "./jwt-helper";

interface HttpError extends Error {
  status: number;
}

/**
 * 抛出带有 status 的错误,改错误会被 koa 框架捕捉,并且得到指定的状态码
 * 因为在这里是不知道是在 koa router 中 还是 graphql 中,所以这里抛出错误时 koa 的,
 * 如果是 graphql 的话需要自己在 resolves 中包裹一层 try catch 判断
 * @param message
 * @param status
 * TODO: 添加 type 字段, error code 等 用于细分错误类型
 */
export function throwHttpError(message: string, status: number): never {
  const error = new Error(message);
  error.name = "HttpError";
  (error as HttpError).status = status;
  throw error;
}

/**
 * 用于graphql resolve 方法中处理内部方法报错
 * @param callback
 * @constructor
 */
export function GraphqlTryErrorHandler(callback: () => Promise<any>) {
  return callback().catch((err) => {
    throw new UserInputError(
      err.message,
      (err as HttpError).status || (500 as any)
    );
  });
}

export const GraphqlAuthenticationVerify = async (
  auth: string
): Promise<JwtPayload> => {
  if (!auth) throw new AuthenticationError("You must be logged in!");
  const token = auth.split("Bearer ")[1];
  if (!token) throw new AuthenticationError("You should provide a token!");
  return JwtHelper.verify(token).catch((err) => {
    throw toApolloError(
      new AuthenticationError("Invalid token!"),
      "TOKEN_ERROR"
    );
  });
};
