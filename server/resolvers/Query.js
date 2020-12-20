const { photos } = require("../fixtures/data");

module.exports = {
  // 回傳 photos 陣列的長度
  totalPhotos: () => photos.length,
  allPhotos: () => photos,
};
