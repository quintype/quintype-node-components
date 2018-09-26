import React from 'react';
import PropTypes from 'prop-types';
import { postRequest } from '../api-client';

function createSession(provider, token) {
  return postRequest(`/api/login/${provider}`, {
    token,
    'set-session': true
  }).json(r => r);
}

export class WithSocialLogin extends React.Component {
  constructor(props) {
    super(props);
    this.serverSideLoginPath = `/login?auth-provider=${this.props.provider}&remote-host=${global.location && global.location.origin}`;
  }

  componentDidMount() {
    this.props.initialize();
  }

  render() {
    return this.props.children({
      login: props => this.props.socialLogin.call(this, props).then(token => createSession(this.props.provider, token)),
      serverSideLoginPath: this.serverSideLoginPath
    });
  }
}

WithSocialLogin.propTypes = {
  initialize: PropTypes.func.isRequired,
  socialLogin: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired
};

WithSocialLogin.defaultProps = {
  initialize: () => {},
  // function is rebound in WithSocialLogin
  socialLogin: function() {
    window.location = this.serverSideLoginPath;
    return Promise.reject('EXPECT_REDIRECT');
  }
}
