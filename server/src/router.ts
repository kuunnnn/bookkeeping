import { join } from "path";

import { Env } from "./config";
import { loadController } from "./lib/decorator-router";

export function loadRouter () {
  return loadController(
    join( __dirname, "./controller" ),
    {
      // output: Env.__DEV__ ? join( __dirname, "./router-tables.json" ) : undefined,
      output:join( __dirname, "./router-tables.json" ),
    }
  );
}
