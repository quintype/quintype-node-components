import React from "react";
import { ResponsiveImage } from "./responsive-image";
import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";

/**
 * This component takes is a wrapper over {@link ResponsiveImages}, which accepts a story and returns the alt hero image if present else returns the hero image. By default, it picks the alt text from the headline.
 *
 * ```javascript
 * import { ResponsiveHeroImage } from '@quintype/components';
 * <figure className="story-grid-item-image qt-image-16x9">
 *   <ResponsiveHeroImage story={props.story}
 *     aspectRatio={[16,9]}
 *     defaultWidth={480} widths={[250,480,640]} sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *     imgParams={{auto:['format', 'compress']}}/>
 * </figure>
 * ```
 * @component
 * @category Images
 */
export function ResponsiveHeroImage(props) {
  return React.createElement(
    ResponsiveImage,
    Object.assign(
      {
        slug: get(
          props,
          [
            "story",
            "alternative",
            "home",
            "default",
            "hero-image",
            "hero-image-s3-key"
          ],
          get(props, ["story", "hero-image-s3-key"])
        ),
        metadata: props.story["hero-image-metadata"],
        alt: props.story["headline"]
      },
      omit(props, ["story"])
    )
  );
}
