import dotEnv from "dotenv";

import { logger } from "./logger/logger";

// 因为 dotEnv 会读取 .env 文件变量但是不会覆盖 本身存在的变量所以 在容器中运行时不会有影响
dotEnv.config();
const env = process.env;

function threwSetupError(msg: string): never {
  throw new Error(msg);
}

const necessaryEnvKey = [
  "redis_port",
  "redis_pass",
  "mongo_link",
  "jwt_secret",
  "server_post",
  "mysql_db_name",
  "mysql_user_name",
  "mysql_user_pass",
  "mysql_port",
  "mysql_host",
];

for (const key of necessaryEnvKey) {
  if (env[key] === undefined) {
    threwSetupError(`config error: not found env.${key}`);
  }
}

export const Env = {
  __DEV__: env.NODE_ENV !== "production",
  redis_port: Number(env.redis_port),
  redis_host: env.redis_host as string,
  redis_pass: env.redis_pass as string,
  mongo_link: env.mongo_link as string,
  jwt_secret: env.jwt_secret as string,
  server_post: Number(env.server_post),
  mysql_db_name: env.mysql_db_name as string,
  mysql_user_name: env.mysql_user_name as string,
  mysql_user_pass: env.mysql_user_pass as string,
  mysql_port: Number(env.mysql_port),
  mysql_host: env.mysql_host as string,
};
