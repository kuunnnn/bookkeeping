import Koa from "koa";

import { GraphqlAuthenticationVerify } from "../utils/error-helper";
import { JwtPayload } from "../utils/jwt-helper";

export interface Context {
  jwtData: JwtPayload;
}

interface ContextFuncParams {
  ctx: Koa.Context;
}

export async function createContext({
  ctx,
}: ContextFuncParams): Promise<Context> {
  const auth = ctx.request.header.authorization || "";
  const jwtData = await GraphqlAuthenticationVerify(auth);
  return { jwtData };
}
