module.exports = {
  me: (parent, args, { currentUser }) => currentUser,

  // 回傳 photos 陣列的長度
  totalPhotos: (parent, args, { db }) =>
    db.collection("photos").estimatedDocumentCount(),

  allPhotos: (parent, args, { db }) => {
    // if (args.first > 100) {
    //   throw new Error("Only 100 photos can be requested at a time");
    // }

    return db.collection("photos").find().toArray();
  },

  totalUsers: (parent, args, { db }) =>
    db.collection("users").estimatedDocumentCount(),

  allUsers: (parent, args, { db }) => db.collection("users").find().toArray(),
};
