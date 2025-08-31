import React from 'react';
import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { WithHostUrl } from '..';

afterEach(cleanup);

describe("WithHostUrl", () => {
  it("Passes the hosts to the render props", () => {
    const { container } = render(
      <Provider
        store={createStore(x => x, {
          qt: {
            primaryHostUrl: "https://www.foo.com",
            currentHostUrl: "https://subdomain.foo.com"
          }
        })}
      >
        <WithHostUrl>
          {({ primaryHostUrl, currentHostUrl }) => (
            <div>
              <div>primaryHostUrl: {primaryHostUrl}</div>
              <div>currentHostUrl: {currentHostUrl}</div>
            </div>
          )}
        </WithHostUrl>
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
