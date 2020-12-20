const { authorizeWithGithub } = require("../lib");
const { photos } = require("../fixtures/data");

require("dotenv").config();

// 將遞增這個變數來產生不重複的 id
var _id = 0;

// Mutation 與 postPhoto 解析函式
module.exports = {
  async githubAuth(parent, { code }, { db }) {
    // 從 GitHub 取得資料
    let {
      message,
      access_token,
      avatar_url,
      login,
      name,
    } = await authorizeWithGithub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code,
    });
    // 如果有訊息，代表出問題了
    if (message) {
      throw new Error(message);
    }
    // 將結果包成一個物件
    let lastUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };
    // 用新的資訊來加入或更新紀錄
    const {
      ops: [user],
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, lastUserInfo, { upsert: true });

    // 回傳使用者資料與他們的權杖
    return { user, token: access_token };
  },

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
