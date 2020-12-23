import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { withApollo } from 'react-apollo';

import './App.css';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';
import Photos from './Photos';
import PostPhoto from './PostPhoto';
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
        <Switch>
          <Route
            exact
            path='/'
            component={() => (
              <Fragment>
                <AuthorizedUser />
                <Users />
                <Photos />
              </Fragment>
            )}
          />
          <Route path='/newPhoto' component={PostPhoto} />
          <Route
            component={({ location }) => (
              <h1>'{location.pathname}' not found</h1>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withApollo(App);
