const { GraphQLScalarType } = require("graphql");

const { users, photos, tags } = require("../fixtures/data");

module.exports = {
  Photo: {
    id: (parent) => parent.id || parent._id,
    url: (parent) => `/images/photos/${parent._id}.jpg`,
    postedBy: (parent, args, { db }) =>
      db.collection("users").findOne({ githubLogin: parent.userId }),
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
