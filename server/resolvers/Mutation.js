const fetch = require("node-fetch");

const { authorizeWithGithub } = require("../lib");
const { photos } = require("../fixtures/data");

require("dotenv").config();

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

  async addFakeUsers(parent, { count }, { db }) {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;
    const { results } = await fetch(randomUserApi)
      .then((res) => res.json())
      .catch((err) => console.error(JSON.stringify(err)));

    const users = results.map((result) => ({
      githubLogin: result.login.username,
      name: `${result.name.first} ${result.name.last}`,
      avatar: result.picture.thumbnail,
      githubToken: result.login.sha1,
    }));

    await db.collection("users").insert(users);

    return users;
  },

  async fakeUserAuth(parent, { githubLogin }, { db }) {
    const user = await db.collection("users").findOne({ githubLogin });
    if (!user) {
      throw Error(`Cannot find user with githubLogin "${githubLogin}"`);
    }

    return {
      token: user.githubToken,
      user,
    };
  },

  async postPhoto(parent, args, { db, currentUser }) {
    // 如果 context 裡面沒有使用者，就丟出錯誤
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo");
    }

    // 與照片一起儲存當前使用者的 id
    const newPhoto = {
      ...args.input,
      userId: currentUser.githubLogin,
      created: new Date(),
    };

    // 插入新照片，捕捉資料庫建立的 id
    const { insertedIds } = await db.collection("photos").insert(newPhoto);
    newPhoto.id = insertedIds[0];

    // 回傳新照片
    return newPhoto;
  },
};
