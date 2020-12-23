module.exports = {
  newUser: {
    subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("user-added"),
  },

  newPhoto: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator("photo-added"),
  },
};
