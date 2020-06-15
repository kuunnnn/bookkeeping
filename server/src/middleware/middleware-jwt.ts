import { Context } from "koa";
import jwt from "koa-jwt";

import { Env } from "../config";
import { JwtHelper, OriginalJwtPayload } from "../utils/jwt-helper";

const unlessPathList = [/^\/pub/, "/sys/health"];

async function isRevoked(
  ctx: Context,
  decode: OriginalJwtPayload
): Promise<boolean> {
  return JwtHelper.isRevoked(decode);
}

export function jwtMiddleware() {
  return jwt({
    secret: Env.jwt_secret,
    tokenKey: "token",
    isRevoked: isRevoked,
  }).unless({ path: unlessPathList });
}
