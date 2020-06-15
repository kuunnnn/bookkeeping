import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-koa";
import { join } from "path";

import { createContext } from "./context";
import { resolvers } from "./resolver";

const schema = loadSchemaSync(join(__dirname, "../../schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});
const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

export const server = new ApolloServer({
  schema: schemaWithResolvers,
  context: createContext,
});
