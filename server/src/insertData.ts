import { createConnection } from "typeorm";

import { Env } from "./config";
import json from "./currencies.json";
import { TblAccount } from "./entity/tbl-account";
import { TblCategory } from "./entity/tbl-category";
import { TblCurrency } from "./entity/tbl-currency";
import { TblRecord } from "./entity/tbl-record";
import { TblUser } from "./entity/tbl-user";

async function connectMysql() {
  const connection = await createConnection({
    type: "mysql",
    host: Env.mysql_host.toString(),
    password: Env.mysql_user_pass,
    username: Env.mysql_user_name,
    port: Env.mysql_port,
    database: Env.mysql_db_name,
    entities: [TblUser, TblAccount, TblCategory, TblCurrency, TblRecord],
    logger: "file",
    logging: ["query", "error"],
    synchronize: true,
  });
  for (const item of json) {
    await connection.getRepository(TblCurrency).insert({
      name: item.name,
      code: item.code,
      symbol: item.symbol_native,
    });
  }
  await connection.close();
}

connectMysql().catch((err) => {
  console.log(err);
});
