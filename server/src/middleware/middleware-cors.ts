import cors from "@koa/cors";

const corsOptions: cors.Options = {
  // origin: "http://127.0.0.1:8081"
  origin: "*",
};

export function corsMiddleware() {
  return cors(corsOptions);
}
