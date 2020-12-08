import React from 'react';
import { WithSocialLogin } from './with-social-login';

/**
 * @see {@link WithSocialLogin}
 * @component
 * @category Login
 */
export function WithLinkedInLogin({ clientKey, children, scope, emailMandatory, redirectUrl, sso, isBridgekeeperLogin = false }) {
  return React.createElement(WithSocialLogin, {
    provider: 'linkedin',
    initialize: () => loadLinkedInSdk(clientKey, scope),
    socialLogin: () => loginWithLinkedIn({ emailMandatory }),
    children: children,
    redirectUrl,
    sso,
    isBridgekeeperLogin,
  });
}

const loadLinkedInSdk = (clientKey, scope) => {
  if (global.IN) {
    return;
  }

  const script = document.createElement('script');
  script.src = '//platform.linkedin.com/in.js';
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.innerHTML = `\n\
  api_key: ${clientKey}\n\
`;
  document.getElementsByTagName('body')[0].appendChild(script);
};

const loginWithLinkedIn = ({ emailMandatory }) => {
  if(!global.IN || !global.IN.User) {
    return Promise.reject("NOT_LOADED");
  }

  return new Promise((resolve, reject) => {
    global.IN.User.authorize((e) => {
      if(global.IN.User.isAuthorized()) {
        resolve({"access-token": global.IN.ENV.auth.oauth_token, client: true})
      } else {
        reject("NOT_GRANTED");
      }
    });
  });
}
