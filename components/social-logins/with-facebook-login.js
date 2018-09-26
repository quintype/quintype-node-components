import React from 'react';
import { WithSocialLogin } from './with-social-login';

function loadFacebookSDK(appId) {
  if (global.FB) {
    return;
  }

  global.fbAsyncInit = global.fbAsyncInit || function() {
    global.FB.init({
      appId,
      xfbml: true,
      version: 'v3.1'
    });
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

function fbLogin(params) {
  return new Promise((resolve, reject) =>
    global.FB.login(response => response.status === 'connected' 
      ? resolve({ 'access-token': response.authResponse.accessToken }) 
      : reject('NOT_GRANTED'),
      params));
}

function fbVerifyEmailExists(token) {
  return new Promise((resolve, reject) =>
    global.FB.api('/me', { fields: 'email' }, response =>
      response.email ? resolve(token) : reject('NO_EMAIL')
    )
  );
}

function loginWithFacebook({scope, emailMandatory} = {}) {
  if(!global.FB) {
    return Promise.reject('NOT_LOADED')
  }

  return fbLogin({scope})
    .then(token => emailMandatory ? fbVerifyEmailExists(token) : token)
}

export function WithFacebookLogin({appId, children, scope, emailMandatory}) {
  return React.createElement(WithSocialLogin, {
    provider: 'facebook',
    initialize: () => loadFacebookSDK(appId),
    socialLogin: () => loginWithFacebook({ scope, emailMandatory }),
    children
  });
}