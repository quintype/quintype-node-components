import { WithHostUrl } from '..';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen } from "@testing-library/react";
import React from 'react';

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
