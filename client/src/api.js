import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage,
});
if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist']);
  cache.restore(cacheData);
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem('token'),
      },
    }));
  },
  cache,
});

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

export const ADD_FAKE_USERS_MUTATION = gql`
  mutation fakeUserAuth($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

export const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

export default client;
