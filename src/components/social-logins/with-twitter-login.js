import React from 'react';
import { WithSocialLogin } from './with-social-login';

/**
 * @see {@link WithSocialLogin}
 * @component
 * @category Login
 */
export function WithTwitterLogin({ clientId, children, scope, emailMandatory, redirectUrl, sso }) {
  return React.createElement(WithSocialLogin, {
    provider: 'twitter',
    children: children,
    redirectUrl,
    sso
  });
}
