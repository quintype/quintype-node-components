import wretch from 'wretch';

const apiClient = wretch().options({credentials: 'same-origin'});

export function getRequest(url, params, { mountAt = global.qtMountAt || "" } = {}) {
  let client = apiClient.url(`${mountAt}${url}`);
  if(params)
    client = client.query(params);
  return client.get();
}

export function postRequest(url, body, { mountAt = global.qtMountAt || "" } = {}) {
  return apiClient
    .url(`${mountAt}${url}`)
    .post(body);
}
