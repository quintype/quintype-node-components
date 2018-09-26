import wretch from 'wretch';

const apiClient = wretch().options({credentials: 'same-origin'});

export function getRequest(url, params) {
  var client = apiClient.url(url);
  if(params)
    client = client.query(params);
  return client.get();
}

export function postRequest(url, body) {
  return apiClient
    .url(url)
    .post(body);
}