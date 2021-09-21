import 'jest-dom/extend-expect';
import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, render } from 'react-testing-library';
import { createStore } from 'redux';
import { SocialShare } from '../components/social-share';

afterEach(cleanup);

describe("SocialShare", () => {
  it("URL encodes the title for twitter", () => {
    const {container} = render(
      <Provider store={createStore(x => x, { qt: { config: {} } })}>
        <SocialShare
          fullUrl="https://www.google.com"
          title="Amazing Link"
          hashtags="awesome"
          template={({ twitterUrl }) => <span>{twitterUrl}</span>} />
      </Provider>
    )

    expect(container.firstChild).toHaveTextContent("https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.google.com&text=Amazing%20Link&hashtags=awesome");
  });
})
