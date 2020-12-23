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

export default client;
