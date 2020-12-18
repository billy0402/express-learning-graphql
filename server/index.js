const { ApolloServer } = require("apollo-server");

const typeDefs = `
  type Query {
    totalPhotos: Int!
  }
  
  type Mutation {
    postPhoto(name: String!, description: String): Boolean!
  }
`;

// 照片在記憶體內的資料型態
var photos = [];

const resolvers = {
  Query: {
    // 回傳 photos 陣列的長度
    totalPhotos: () => photos.length,
  },

  // Mutation 與 postPhoto 解析函式
  Mutation: {
    postPhoto(parent, args) {
      photos.push(args);
      return true;
    },
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
