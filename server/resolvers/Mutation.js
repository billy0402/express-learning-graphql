const { photos } = require("../fixtures/data");

// 將遞增這個變數來產生不重複的 id
var _id = 0;

// Mutation 與 postPhoto 解析函式
module.exports = {
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
};
