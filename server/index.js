const { ApolloServer } = require("apollo-server");

const typeDefs = `
  # 加入 Photo 型態定義
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }
  
  # 從 allPhotos 回傳 Photo
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }
  
  # 從 mutation 回傳新貼出的照片
  type Mutation {
    postPhoto(name: String!, description: String): Photo!
  }
`;

// 將遞增這個變數來產生不重複的 id
var _id = 0;
// 照片在記憶體內的資料型態
var photos = [];

const resolvers = {
  Query: {
    // 回傳 photos 陣列的長度
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  // Mutation 與 postPhoto 解析函式
  Mutation: {
    postPhoto(parent, args) {
      // 建立新照片，與產生一個 id
      var newPhoto = {
        id: _id++,
        ...args,
      };
      photos.push(newPhoto);

      // 回傳新照片
      return newPhoto;
    },
  },

  Photo: {
    url: (parent) => `http://yoursite.com/images/${parent.id}.jpg`,
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
