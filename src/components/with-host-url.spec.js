import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import { createStore } from 'redux';
import { WithHostUrl } from '../components/with-host-url';

afterEach(cleanup);

describe("WithHostUrl", () => {
  it("Passes the hosts to the render props", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { primaryHostUrl: "https://www.foo.com", currentHostUrl: "https://subdomain.foo.com"} })}>
        <WithHostUrl>{({ primaryHostUrl, currentHostUrl }) =>
          <div>
            <div>primaryHostUrl: {primaryHostUrl}</div>
            <div>currentHostUrl: {currentHostUrl}</div>
          </div>
        }</WithHostUrl>
      </Provider>
    )
    expect(container.firstChild).toMatchSnapshot();
  });
})
