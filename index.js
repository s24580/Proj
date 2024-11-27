import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();
const port = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/graphql`);
});
