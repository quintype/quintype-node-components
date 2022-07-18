import omit from "@babel/runtime/helpers/objectWithoutProperties";
import get from "lodash/get";
import React from "react";
import { ResponsiveImage } from "./responsive-image";

/**
 * This component is a wrapper over {@link ResponsiveImages}. It accepts story as a prop and renders story's hero image.
 * If hero-image-s3-key is present, it takes that as slug and the story headline as image alt text.
 * Else it takes the slug from the alternate hero-image, alt text as alternate headline.
 * If both are absent, it doesn't render
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
  let metadata, slug, alternateText;
  const heroImageS3Key = get(props, ["story", "hero-image-s3-key"], "");
  const storyAlternateData = get(props, ["story", "alternative", "home", "default"], {}) || {};
  const alternateHeroImageS3Key = get(storyAlternateData, ["hero-image", "hero-image-s3-key"], "");

  if (heroImageS3Key) {
    slug = heroImageS3Key;
    metadata = get(props, ["story", "hero-image-metadata"], {});
    alternateText = props.alt ? alt : get(props, ["story", "headline"], "");
  } else if (alternateHeroImageS3Key) {
    slug = alternateHeroImageS3Key;
    metadata = get(storyAlternateData, ["hero-image", "hero-image-metadata"], {});
    alternateText = get(storyAlternateData, ["headline"], "");
  } else return null;

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
