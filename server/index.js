const { ApolloServer } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");

const typeDefs = `
  scalar DateTime
  
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
    inPhotos: [Photo!]!
  }
  
  # 加入 Photo 型態定義
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
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
    created: "3-28-1977",
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "1-2-1985",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "2018-04-15T19:09:57.308Z",
  },
];
var tags = [
  { photoId: "1", userId: "gPlake" },
  { photoId: "2", userId: "sSchmidt" },
  { photoId: "2", userId: "mHattrup" },
  { photoId: "2", userId: "gPlake" },
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
        created: new Date(),
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
    taggedUsers: (parent) =>
      tags
        // 回傳一個只含有當前照片的 tag 陣列
        .filter((tag) => tag.photoId === parent.id)
        // 將 tag 陣列轉換成 userId 陣列
        .map((tag) => tag.userId)
        // 將 userId 陣列轉換成使用者物件陣列
        .map((userId) => users.find((user) => user.githubLogin === userId)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((photo) => photo.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) =>
      tags
        // 回傳一個只含有當前使用者的 tag 陣列
        .filter((tag) => tag.userId === parent.id)
        // 將 tag 陣列轉換成 photoId 陣列
        .map((tag) => tag.photoId)
        // 將 photoId 陣列轉換成照片物件陣列
        .map((photoId) => photos.find((photo) => photo.id === photoId)),
  },

  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value",
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => ast.value,
  }),
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
