const { ApolloServer, PubSub } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { createServer } = require("http");
const { MongoClient } = require("mongodb");
const { readFileSync } = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const depthLimit = require("graphql-depth-limit");
const { createComplexityLimitRule } = require("graphql-validation-complexity");

require("dotenv").config();
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

// 建立非同步函式
async function start() {
  // 呼叫 `express()` 來建立 Express app
  const app = express();

  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
  const db = client.db();

  const pubsub = new PubSub();

  // 建立伺服器的新實例
  // 傳送一個含有 typeDefs (schema) 與 resolvers 的物件給它
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // https://engine.apollographql.com
    engine: true,
    validationRules: [
      depthLimit(5),
      createComplexityLimitRule(1000, {
        onCost: (cost) => console.log("query cost: ", cost),
      }),
    ],
    context: async ({ req, connection }) => {
      const githubToken = req
        ? req.headers.authorization
        : connection.context.Authorization;
      const currentUser = await db.collection("users").findOne({ githubToken });

      return { db, currentUser, pubsub, timestamp: performance.now() };
    },
  });

  // 呼叫 `applyMiddleware()` 來將中介軟體安裝在同一個路徑上
  server.applyMiddleware({ app });

  // 建立首頁路由
  app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  app.use(
    "/images/photos",
    express.static(path.join(__dirname, "assets", "photos"))
  );

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.timeout = 5000;

  // 監聽特定連接埠
  httpServer.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Service running @ http://localhost:4000${server.graphqlPath}`
    )
  );
}

// 準備就緒可啟動時，呼叫 start
start();
