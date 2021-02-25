import React from "react";
import { ResponsiveImage } from "./responsive-image";
import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";

/**
 * This component takes in a wrapper over {@link ResponsiveImages}, which accepts a story and supportStoryAlternatives prop which in turn returns the alternate data if supportStoryAlternatives is true else returns the story data. By default, it picks the alt text from the headline.
 *
 * ```javascript
 * import { ResponsiveHeroImage } from '@quintype/components';
 * <figure className="story-grid-item-image qt-image-16x9">
 *   <ResponsiveHeroImage story={props.story}
 *     supportStoryAlternatives={false}
 *     aspectRatio={[16,9]}
 *     defaultWidth={480} widths={[250,480,640]} sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *     imgParams={{auto:['format', 'compress']}}/>
 * </figure>
 * ```
 * @component
 * @category Images
 */
export function ResponsiveHeroImage(props) {
  const { supportStoryAlternatives = false, story } = props;
  const alternateData = get(props, ["story", "alternative", "home", "default"]);
  return React.createElement(
    ResponsiveImage,
    Object.assign(
      {
        slug:
          (supportStoryAlternatives &&
            get(alternateData, ["hero-image", "hero-image-s3-key"])) ||
          get(story, ["hero-image-s3-key"]),
        metadata:
          (supportStoryAlternatives &&
            get(alternateData, ["hero-image", "hero-image-metadata"])) ||
          get(story, ["hero-image-metadata"]),
        alt:
          (supportStoryAlternatives && get(alternateData, ["headline"])) ||
          get(story, ["headline"])
      },
      omit(props, ["story"])
    )
  );
}
