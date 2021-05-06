import { ResponsiveHeroImage } from "..";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render, cleanup } from "react-testing-library";
import React from "react";

afterEach(cleanup);

const story = {
  alternative: {
    home: {
      default: {
        "hero-image": {
          "hero-image-s3-key": "somepublisher/image.png",
          "hero-image-metadata": {
            width: 760,
            height: 427,
            "focus-point": [306, 125],
          },
        },
        headline: "Alt Text",
      },
    },
  },
};

describe("ResponsiveHeroImage", () => {
  it("Picks alternate data if story data not present", () => {
    const { container } = render(
      <Provider store={createStore((x) => x, { qt: { config: {'cdn-image': "images.assettype.com"} } })}>
        <ResponsiveHeroImage
          story={story}
          aspectRatio={[16, 9]}
          defaultWidth={480}
          widths={[250, 480, 640]}
          sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
          imgParams={{ auto: ["format", "compress"] }}
        />
      </Provider>
    );
    const image = container.firstChild;
    expect(image.getAttribute("src")).toBe("//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=480&auto=format%2Ccompress");
    expect(image.getAttribute("srcset")).toBe("//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=250&auto=format%2Ccompress 250w,//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=480&auto=format%2Ccompress 480w,//images.assettype.com/somepublisher%2Fimage.png?rect=0%2C0%2C759%2C427&w=640&auto=format%2Ccompress 640w");
    expect(image.getAttribute("alt")).toBe("Alt Text");
    expect(image).toMatchSnapshot();
  });
});
