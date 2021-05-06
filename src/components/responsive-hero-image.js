import React from "react";
import { ResponsiveImage } from "./responsive-image";
import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";

/**
 * This component takes in a wrapper over {@link ResponsiveImages}, which accepts a story, if the story data is present it returns the story data else if the story data is not present and the alternate data is present it returns alternate data. By default, it picks the alt text from the headline.
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
  const { story = {} } = props;
  const alternativeData = get(story, ["alternative", "home", "default"], {});

  const { headline: altHeadline } = alternativeData;
  const {
    "hero-image-s3-key": altSlug,
    "hero-image-metadata": altMetadata,
  } = get(alternativeData, ["hero-image"], {});

  const slug = get(story, ["hero-image-s3-key"], altSlug);
  const metadata = get(story, ["hero-image-metadata"], altMetadata);
  const alternateText = get(story, ["headline"], altHeadline);

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
