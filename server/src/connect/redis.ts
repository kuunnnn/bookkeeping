import Redis from "ioredis";

import { Env } from "../config";
import { logger } from "../logger/logger";

export const redis = new Redis({
  port: Env.redis_port,
  host: Env.redis_host,
  password: Env.redis_pass,
  family: 4,
  db: 0,
});

redis.on("error", function (error) {
  logger.fatal({
    message: "redis connect error: " + error.message,
    redis: {
      port: Env.redis_port,
      host: Env.redis_host,
      pass: Env.redis_pass,
    },
  });
  throw error;
});
