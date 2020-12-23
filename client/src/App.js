import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';

import './App.css';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';
import { LISTEN_FOR_USERS, ROOT_QUERY } from './api';

class App extends Component {
  componentDidMount() {
    let { client } = this.props;
    this.listenForUsers = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        data.totalUsers += 1;
        data.allUsers = [...data.allUsers, newUser];
        client.writeQuery({ query: ROOT_QUERY, data });
      });
  }

  componentWillUnmount() {
    this.listenForUsers.unsubscribe();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <AuthorizedUser />
          <Users />
        </div>
      </BrowserRouter>
    );
  }
}

export default withApollo(App);
