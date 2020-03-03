import { ResponsiveImage } from '..';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, cleanup } from 'react-testing-library';
import React from 'react';

afterEach(cleanup);

describe("ResponsiveImage", () => {
  it("Adds a focus point", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: {'cdn-image': "images.assettype.com"}}})}>
        <ResponsiveImage
          slug="somepublisher/image.png"
          metadata={{ "width": 760, "height": 427, "focus-point": [306, 125] }}
          aspectRatio={[16, 9]}
          alt="Alt Text"
          defaultWidth={640}
          widths={[320, 640, 1024]} />
      </Provider>
    );

    const image = container.firstChild;
    expect(image.getAttribute("src")).toBe("//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=640");
    expect(image.getAttribute("srcset")).toBe("//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=320 320w,//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=640 640w,//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=1024 1024w");
    expect(image).toMatchSnapshot();
  });

  it("Does not add a rect param if the focus point is missing", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: { 'cdn-image': "images.assettype.com" } } })}>
        <ResponsiveImage
          slug="somepublisher/image.png"
          metadata={{ "width": 760, "height": 427 }}
          aspectRatio={[16, 9]}
          alt="Alt Text"
          defaultWidth={640}
          widths={[320, 640, 1024]} />
      </Provider>
    );
    const image = container.firstChild;
    expect(image.getAttribute("src")).toBe("//images.assettype.com/somepublisher%2Fimage.png?w=640");
    expect(image.getAttribute("srcset")).toBe("//images.assettype.com/somepublisher%2Fimage.png?w=320 320w,//images.assettype.com/somepublisher%2Fimage.png?w=640 640w,//images.assettype.com/somepublisher%2Fimage.png?w=1024 1024w");
    expect(image).toMatchSnapshot();
  });

  it("Checks for a gumlet image", () => {
    const { container } = render(
      <Provider store={createStore(x => x, { qt: { config: { 'cdn-image': "images.assettype.com", "image-cdn-format": "gumlet" } } })}>
        <ResponsiveImage
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
    expect(image.getAttribute("src")).toBe("data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
    expect(image).toMatchSnapshot();
  });
})
