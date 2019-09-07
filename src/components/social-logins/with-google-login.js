import React from 'react';
import { WithSocialLogin } from './with-social-login';

/**
 * @see {@link WithSocialLogin}
 * @component
 * @category Login
 */
export function WithGoogleLogin({ clientId, children, scope, emailMandatory }) {
  return React.createElement(WithSocialLogin, {
    provider: 'google',
    initialize: () => loadGoogleSDK(clientId, scope),
    socialLogin: () => loginWithGoogle({ emailMandatory }),
    children: children
  });
}


const onScriptLoaded = (clientId, scope) => {
  global.gapi.load('client:auth2', () =>
    global.gapi.client.init({ clientId, scope })
  );
};

const loginWithGoogle = ({ emailMandatory } = {}) => {
  if(!global.gapi || !global.gapi.client) {
    return Promise.reject("NOT_LOADED");
  }

  const GoogleAuth = global.gapi.auth2.getAuthInstance();

  if (!GoogleAuth) {
    return Promise.reject("NOT_LOADED");
  }

  return GoogleAuth.signIn()
    .then(response =>
      emailMandatory && !response.getBasicProfile().getEmail()
        ? Promise.reject('NO_EMAIL')
        : { 'access-token': response.getAuthResponse().access_token }
    )
    .catch(() => Promise.reject('NOT_GRANTED'));
};

const loadGoogleSDK = (clientId, scope) => {
  if (global.gapi) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.async = true;
  script.defer = true;
  script.onload = () => onScriptLoaded(clientId, scope);
  document.getElementsByTagName('body')[0].appendChild(script);
};
