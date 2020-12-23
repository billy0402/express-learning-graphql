import { request } from 'graphql-request';

const url = 'http://localhost:4000/graphql';

const query = `
  query {
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const mutation = `
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
    }
  }
`;

const requestAndRender = (render) =>
  request(url, query).then(render).catch(console.error);

const addUser = () =>
  request(url, mutation, { count: 1 })
    .then(requestAndRender)
    .catch(console.error);

export { requestAndRender, addUser };
