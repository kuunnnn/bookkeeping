import Koa from "koa";

import { Controller, Get } from "../lib/decorator-router";

@Controller("/sys")
export class SysController {
  @Get("/health")
  health(ctx: Koa.Context) {
    ctx.body = { ok: true };
  }
}
