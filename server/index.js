const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { readFileSync } = require("fs");

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

// 呼叫 `express()` 來建立 Express app
var app = express();

// 建立伺服器的新實例
// 傳送一個含有 typeDefs (schema) 與 resolvers 的物件給它
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 呼叫 `applyMiddleware()` 來將中介軟體安裝在同一個路徑上
server.applyMiddleware({ app });

// 建立首頁路由
app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

// 監聽特定連接埠
app.listen({ port: 4000 }, () =>
  console.log(
    `GraphQL Service running @ http://localhost:4000${server.graphqlPath}`
  )
);
