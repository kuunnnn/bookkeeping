import { createConnection } from "typeorm";

import { Env } from "../config";
import { TblAccount } from "../entity/tbl-account";
import { TblCategory } from "../entity/tbl-category";
import { TblCurrency } from "../entity/tbl-currency";
import { TblRecord } from "../entity/tbl-record";
import { TblUser } from "../entity/tbl-user";

export async function connectMysql() {
  await createConnection({
    type: "mysql",
    host: Env.mysql_host.toString(),
    password: Env.mysql_user_pass,
    username: Env.mysql_user_name,
    port: Env.mysql_port,
    database: Env.mysql_db_name,
    logger: "file",
    // logger: "advanced-console",
    logging: ["error", "schema"],
    entities: [TblAccount, TblCurrency, TblUser, TblCategory, TblRecord],
    synchronize: true,
    maxQueryExecutionTime: 1000,
  });
}
