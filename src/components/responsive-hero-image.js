import React from "react";
import { ResponsiveImage } from "./responsive-image";
import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";

/**
 * This component takes in a wrapper over {@link ResponsiveImages}, which accepts a story and supportStoryAlternatives prop which in turn returns the alternate data if story data is not present and the supportStoryAlternatives prop is set to true else returns the story data. By default, it picks the alt text from the headline.
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
  const slug =
    get(story, ["hero-image-s3-key"]) ||
    (supportStoryAlternatives &&
      get(alternateData, ["hero-image", "hero-image-s3-key"]));
  const metadata =
    get(story, ["hero-image-metadata"]) ||
    (supportStoryAlternatives &&
      get(alternateData, ["hero-image", "hero-image-metadata"]));
  const alternateText =
    get(story, ["headline"]) ||
    (supportStoryAlternatives && get(alternateData, ["headline"]));
  return React.createElement(
    ResponsiveImage,
    Object.assign(
      {
        slug,
        metadata,
        alt: alternateText,
      },
      omit(props, ["story"])
    )
  );
}
