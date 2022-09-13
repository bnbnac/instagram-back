import express from "express";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import "dotenv/config";
import morgan from "morgan";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { getUser } from "./users/users.utils";
import client from "./client";
import { typeDefs, resolvers } from "./schema";

const PORT = process.env.PORT;
const schema = makeExecutableSchema({ typeDefs, resolvers });

const startServer = async () => {
  const app = express();
  app.use(morgan("dev"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer(
    {
      schema,
      // send the return value to subscription's context
      context: async (ctx) => {
        return {
          loggedInUser: await getUser(ctx.connectionParams.token),
          client,
        };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true, // what is this!!!!!!!
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // {
      //   async requestDidStart(requestContext) {
      //     console.log("Request started! Query:\n" + requestContext.request);
      //   },
      // },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: async (ctx) => {
      // http part
      if (ctx.req) {
        const IN_PAGE = 3;
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
          IN_PAGE,
          client,
        };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen({ port: PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

startServer();
