import { ResponsiveSource } from '..';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, cleanup } from 'react-testing-library';
import React from 'react';

afterEach(cleanup);

describe("ResponsiveSource", () => {
  it("Checks for a gumlet image", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: { 'cdn-image': "images.assettype.com", "image-cdn-format": "gumlet" } } })}>
        <ResponsiveSource
          slug="somepublisher/image.png"
          metadata={{ "width": 760, "height": 427, "focus-point": [306, 125] }}
          aspectRatio={[16, 9]}
          alt="Alt Text"
          defaultWidth={640}
          widths={[320, 640, 1024]} />
      </Provider>
    );

    const image = container.firstChild;
    expect(image.getAttribute("data-src")).toBe("https://images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427");
    expect(image.getAttribute("src")).toBe(null);
    expect(image).toMatchSnapshot();
  });
})
