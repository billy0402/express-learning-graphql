import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { ADD_FAKE_USERS_MUTATION, ROOT_QUERY } from './api';

const updateUserCache = (cache, { data: { addFakeUsers } }) => {
  let data = cache.readQuery({ query: ROOT_QUERY });
  data.totalUsers += addFakeUsers.length;
  data.allUsers = [...data.allUsers, ...addFakeUsers];
  cache.writeQuery({ query: ROOT_QUERY, data });
};

const Users = () => (
  <Query query={ROOT_QUERY} fetchPolicy='cache-and-network'>
    {({ data, loading, refetch }) =>
      loading ? (
        <p>loading users</p>
      ) : (
        <UserList
          count={data.totalUsers}
          users={data.allUsers}
          refetchUsers={refetch}
        />
      )
    }
  </Query>
);

const UserList = ({ count, users, refetchUsers }) => (
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch Users</button>
    <Mutation
      mutation={ADD_FAKE_USERS_MUTATION}
      variables={{ count: 1 }}
      update={updateUserCache}
    >
      {(addFakeUsers) => <button onClick={addFakeUsers}>Add Fake Users</button>}
    </Mutation>
    <ul>
      {users.map((user) => (
        <UserListItem
          key={user.githubLogin}
          name={user.name}
          avatar={user.avatar}
        />
      ))}
    </ul>
  </div>
);

const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} alt='avatar' width={48} height={48} />
    {name}
  </li>
);

export default Users;
