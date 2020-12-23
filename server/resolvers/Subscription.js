module.exports = {
  newPhoto: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator("photo-added"),
  },
};
