import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

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
            <button onClick={this.requestCode} disabled={this.state.signingIn}>
              Sign In with GitHub
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AuthorizedUser);
