const { request } = require("graphql-request");

const url = "http://localhost:4000/graphql";

const query = `
  query {
    allUsers {
      name
      avatar
    }
  }
`;
request(url, query).then(console.log).catch(console.error);

const mutation = `
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
    }
  }
`;
const variables = { count: 3 };
request(url, mutation, variables).then(console.log).catch(console.error);
