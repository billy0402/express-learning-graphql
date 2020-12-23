import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' });

const query = gql`
  {
    totalUsers
    totalPhotos
  }
`;

client
  .query({ query })
  .then(({ data }) => console.log('data', data))
  .catch(console.error);

console.log('cache', client.extract());
client
  .query({ query })
  .then(() => console.log('cache', client.extract()))
  .catch(console.error);

export default client;
