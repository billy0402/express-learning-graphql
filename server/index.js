const { ApolloServer } = require("apollo-server");

const typeDefs = `
  type Query {
    totalPhotos: Int!
  }
`;

const resolvers = {
  Query: {
    totalPhotos: () => 42,
  },
};

// 建立伺服器的新實例
// 傳送一個含有 typeDefs (schema) 與 resolvers 的物件給它
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 對著伺服器呼叫 listen 來啟動 web 伺服器
server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
