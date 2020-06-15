import { clsProxify } from "cls-proxify";
import { clsProxifyKoaMiddleware } from "cls-proxify/integration/koa";
import fs from "fs";
import { join } from "path";
import pinoms from "pino-multi-stream";

import { Env } from "../config";

const logdir = join.bind(this, process.cwd(), "./logs");

function openLogWriteStream(file: string) {
  return fs.createWriteStream(logdir(file), { flags: "a" });
}

const streams = [
  { level: "info", stream: openLogWriteStream("info.log") },
  { level: "warn", stream: openLogWriteStream("warn.log") },
  { level: "fatal", stream: openLogWriteStream("fatal.log") },
];

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  streams.push({ stream: pinoms.prettyStream() });
}

// @ts-ignore
const defaultLogger = pinoms(pinoms.multistream(streams));

const logger = clsProxify("clsKeyLogger", defaultLogger);

export { defaultLogger, logger, clsProxifyKoaMiddleware };
