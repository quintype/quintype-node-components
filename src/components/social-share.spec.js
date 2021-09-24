import { SocialShare } from "..";
import { Provider } from "react-redux";
import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { createStore } from "redux";
import React from "react";

afterEach(cleanup);

describe("SocialShare", () => {
  it("URL encodes the title for twitter", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: {} } })}>
        <SocialShare
          fullUrl="https://www.google.com"
          title="Amazing Link"
          hashtags="awesome"
          template={({ twitterUrl }) => <span>{twitterUrl}</span>}
        />
      </Provider>
    );

    expect(container.firstChild).toHaveTextContent(
      "https://twitter.com/intent/tweet?url=https://www.google.com&text=Amazing%20Link&hashtags=awesome"
    );
  });

  it("URL encodes the URL for twitter properly", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: {} } })}>
        <SocialShare
          fullUrl="https://ace-web.qtstage.io/%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D/2021/09/24/%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D-%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D-%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D-twitter"
          title="மாநிலம் மாநிலம் மாநிலம் Twitter?"
          hashtags="awesome"
          template={({ twitterUrl }) => <span>{twitterUrl}</span>}
        />
      </Provider>
    );

    expect(container.firstChild).toHaveTextContent(
      "https://twitter.com/intent/tweet?url=https://ace-web.qtstage.io/%25E0%25AE%25AE%25E0%25AE%25BE%25E0%25AE%25A8%25E0%25AE%25BF%25E0%25AE%25B2%25E0%25AE%25AE%25E0%25AF%258D/2021/09/24/%25E0%25AE%25AE%25E0%25AE%25BE%25E0%25AE%25A8%25E0%25AE%25BF%25E0%25AE%25B2%25E0%25AE%25AE%25E0%25AF%258D-%25E0%25AE%25AE%25E0%25AE%25BE%25E0%25AE%25A8%25E0%25AE%25BF%25E0%25AE%25B2%25E0%25AE%25AE%25E0%25AF%258D-%25E0%25AE%25AE%25E0%25AE%25BE%25E0%25AE%25A8%25E0%25AE%25BF%25E0%25AE%25B2%25E0%25AE%25AE%25E0%25AF%258D-twitter&text=%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D%20%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D%20%E0%AE%AE%E0%AE%BE%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%AE%E0%AF%8D%20Twitter%3F&hashtags=awesome"
    );
  });
});
