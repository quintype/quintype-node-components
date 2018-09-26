import React from 'react';
import { WithSocialLogin } from './with-social-login';

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
    IN.User.authorize((e) => {
      if(IN.User.isAuthorized()) {
        resolve({"access-token": IN.ENV.auth.oauth_token, client: true})
      } else {
        reject("NOT_GRANTED");
      }
    });
  });
}

export function WithLinkedInLogin({ clientKey, children, scope, emailMandatory }) {
  return React.createElement(WithSocialLogin, {
    provider: 'linkedin',
    initialize: () => loadLinkedInSdk(clientKey, scope),
    socialLogin: () => loginWithLinkedIn({ emailMandatory }),
    children: children
  });
}
