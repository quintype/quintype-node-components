import React from "react";
import {ResponsiveImage} from './responsive-image';

/**
 * This component is to be used if the aspect of an images changes significantly between different devices.
 *
 * ```javascript
 * import { ResponsiveSource } from '@quintype/components';
 *
 * <figure className="story-grid-item-image">
 *   <picture>
 *     // Desktop Version
 *     <ResponsiveSource media="(min-width: 1024px)"
 *       slug={props.story["hero-image-s3-key"]}
 *       metadata={props.story["hero-image-metadata"]}
 *       aspectRatio={[4,3]}
 *       widths={[250,480,640]}
 *       sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *       imgParams={{auto:['format', 'compress']}}/>
 *
 *     // Mobile Version
 *     <ResponsiveImage
 *       slug={props.story["hero-image-s3-key"]}
 *       metadata={props.story["hero-image-metadata"]}
 *       alt={props.story['headline']}
 *       aspectRatio={[16,9]}
 *       defaultWidth={480} widths={[250,480,640]}
 *       sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *       imgParams={{auto:['format', 'compress']}}/>
 *   </picture>
 * </figure>
 * ```
 * @component
 * @category Images
 */
export const ResponsiveSource = function (props) {
  return React.createElement(ResponsiveImage, Object.assign({
    reactTag: 'source',
    src: false,
    defaultWidth: 1024
  }, props));
}
