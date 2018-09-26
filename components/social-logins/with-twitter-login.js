import React from 'react';
import { WithSocialLogin } from './with-social-login';

export function WithTwitterLogin({ clientId, children, scope, emailMandatory }) {
  return React.createElement(WithSocialLogin, {
    provider: 'twitter',
    children: children
  });
}
