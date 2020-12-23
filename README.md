# [express-learning-graphql](https://github.com/MoonHighway/learning-graphql)

## environment
- [macOS 10.15.6](https://www.apple.com/tw/macos/catalina/)
- [WebStorm 2020.2.1](https://www.jetbrains.com/webstorm/)
- [nvm 0.35.3, node 12.18.3, npm 6.14.6](https://nodejs.org/en/)

## server packages
- [Express](https://expressjs.com/zh-tw/)
- [Apollo](https://www.apollographql.com/docs/)
- [GraphQL](https://graphql.org/)
- [nodemon](https://nodemon.io/)

## database
- [MongoDB](https://www.mongodb.com/)
```sql
use admin;
db.createUser(
  {
    user: "user",
    pwd: "pwd",
    roles: [
        {
            role: "userAdminAnyDatabase",
            db: "admin"
        },
        "readWriteAnyDatabase"
    ]
  }
);
```

## client packages
- [React](https://zh-hant.reactjs.org/)
- [GraphQL](https://graphql.org/)
