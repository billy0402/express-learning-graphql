import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation, withApollo } from 'react-apollo';
import { flowRight } from 'lodash';

import Me from './Me';
import { GITHUB_AUTH_MUTATION, ROOT_QUERY } from './api';

require('dotenv').config();

class AuthorizedUser extends Component {
  state = { signingIn: false };

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace('?code=', '');
      this.githubAuthMutation({ variables: { code } });
    }
  }

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem('token', data.githubAuth.token);
    this.props.history.replace('/');
    this.setState({ signingIn: false });
  };

  requestCode() {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  }

  logout = () => {
    localStorage.removeItem('token');
    let data = this.props.client.readQuery({ query: ROOT_QUERY });
    data.me = null;
    this.props.client.writeQuery({ query: ROOT_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation;
          return (
            <Me
              signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={this.logout}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default flowRight(withRouter, withApollo)(AuthorizedUser);
