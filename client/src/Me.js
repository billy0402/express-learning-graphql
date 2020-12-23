import React from 'react';
import { NavLink } from 'react-router-dom';
import { Query } from 'react-apollo';

import { ROOT_QUERY } from './api';

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {({ data, loading }) =>
      data && data.me ? (
        <CurrentUser {...data.me} logout={logout} />
      ) : loading ? (
        <p>loading...</p>
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with GitHub
        </button>
      )
    }
  </Query>
);

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} alt='avatar' width={48} height={48} />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
    <NavLink to='/newPhoto'>Post Photo</NavLink>
  </div>
);

export default Me;
