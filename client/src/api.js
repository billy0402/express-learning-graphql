import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' });

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
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

export default client;
