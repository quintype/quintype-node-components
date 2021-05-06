import React from "react";
import { ResponsiveImage } from "./responsive-image";
import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";

/**
 * This component takes in a wrapper over {@link ResponsiveImages}, which accepts a story, it returns image from story, if story doesn't have hero-image, it returns alternate hero-image of the story. By default, it picks the alt text from the headline.
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
  const storyAlternateData = get(props, ["story", "alternative", "home", "default"], {});
  const { headline: altHeadline } = storyAlternateData;
  const { "hero-image-s3-key": altSlug, "hero-image-metadata": altMetadata } = get(storyAlternateData, ["hero-image"], {});
  const heroImage = get(props, ["story", "hero-image-s3-key"]);

  const slug = heroImage || altSlug;
  const metadata = (heroImage && get(props, ["story", "hero-image-metadata"])) || altMetadata;
  const alternateText = get(props, ["story", "headline"]) || altHeadline;

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
