const { ApolloServer } = require("apollo-server");

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
  
  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
  }
  
  # 加入 Photo 型態定義
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }
  
  input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
  }
  
  # 從 allPhotos 回傳 Photo
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }
  
  # 從 mutation 回傳新貼出的照片
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

var users = [
  { githubLogin: "mHattrup", name: "Mike Hattrup" },
  { githubLogin: "gPlake", name: "Glen Plake" },
  { githubLogin: "sSchmidt", name: "Scot Schmidt" },
];
// 將遞增這個變數來產生不重複的 id
var _id = 0;
// 照片在記憶體內的資料型態
var photos = [
  {
    id: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubUser: "gPlake",
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
  },
];

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
        ...args.input,
      };
      photos.push(newPhoto);

      // 回傳新照片
      return newPhoto;
    },
  },

  Photo: {
    url: (parent) => `http://yoursite.com/images/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((user) => user.githubLogin === parent.githubUser);
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((photo) => photo.githubUser === parent.githubLogin);
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
