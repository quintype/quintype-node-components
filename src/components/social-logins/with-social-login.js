import React from 'react';
import PropTypes from 'prop-types';
import { postRequest } from '../api-client';

/**
 * This is an abstract render props component for logging in with social accounts. The component adds two items to scope: `serverSideLoginPath` for redirecting to server side, and `login` for doing a client side login. Calling `login()` returns a promise which can be used to handle success and failure cases.
 *
 * This component should not be used directly, but should be used via one of the scomponents mentioned in the example.
 *
 * NOTE:
 * - Twitter and LinkedIn do not support ClientSideLogin, and thus `login()` will just redirect to the server. It also ignores the apiKey
 * - Twitter and LinkedIn do not verify presence of email on the client side. Please ask for these permissions in the app
 *
 * Example
 * ```javascript
 * import { WithFacebookLogin, WithGoogleLogin, WithTwitterLogin, WithLinkedInLogin } from '@quintype/components';
 *
 * function socialLogin(e, login) {
 *   e.preventDefault();
 *   login().then(() => window.location.refresh()); // Can also make an API call to /api/v1/members/me
 * }
 *
 * <WithFacebookLogin appId="apiKey" scope="email" emailMandatory>{({ login, serverSideLoginPath }) =>
 *     <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
 *       <img src={assetify(facebookIcon)} />
 *     </a>
 * }</WithFacebookLogin>
 * <WithGoogleLogin clientId="clientId" scope="email" emailMandatory>{({ login, serverSideLoginPath }) =>
 *     <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
 *       <img src={assetify(gplusIcon)} />
 *     </a>
 * }</WithGoogleLogin>
 * <WithTwitterLogin apiKey="apiKey" emailMandatory>{({login, serverSideLoginPath}) =>
 *     <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
 *       <img src={assetify(twitterIcon)} />
 *     </a>
 * }</WithTwitterLogin>
 * <WithLinkedInLogin clientKey="clientKey" emailMandatory>{({login, serverSideLoginPath}) =>
 *     <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
 *       <img src={assetify(linkedInIcon)} />
 *     </a>
 * }</WithLinkedInLogin>
 * ```
 * @component
 * @hideconstructor
 * @category Login
 */
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

function createSession(provider, token) {
  return postRequest(`/api/login/${provider}`, {
    token,
    'set-session': true
  }).json(r => r);
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
