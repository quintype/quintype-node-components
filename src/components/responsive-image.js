import {connect} from "react-redux";
import React from "react";
import { ThumborImage } from "./impl/thumbor-image";
import { string, arrayOf, number, object } from 'prop-types';
import { GumletImage } from "./impl/gumlet-image";

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"],
    imageCDNFormat: state.qt.config["image-cdn-format"] || "thumbor"
  };
}

function ResponsiveImageBase(props) {
  if (process.env.NODE_ENV == 'development' && !props.alt && !props.reactTag) {
    global.console && global.console.warn(`Image Found without an alt attribute: ${props.slug}`);
  }

  if(props.imageCDNFormat === "gumlet") {
    return React.createElement(GumletImage, props);
  }
  return React.createElement(ThumborImage, props);
}

ResponsiveImageBase.propTypes = {
  /** The Path to the image, relative to images.assettype.com. Usually publisher/yyyy/mm/<rand>/image-name.type */
  slug: string.isRequired,

  /** The image metadata as returned by the editor. Usually has width, height and focus point */
  metadata: object,

  /** The alt text for this image */
  alt: string.isRequired,

  /** The aspect ratio of the image output. Ex: [16, 9] */
  aspectRatio: arrayOf(number),

  /** The default width for the image, in case the browser does not support srcset */
  defaultWidth: number,

  /** The list of available widths */
  widths: arrayOf(number),

  /** Hints for the browser to choose the best size. See <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Different_sizes">Syntax</a> */
  sizes: string,

  /** Other parameters to pass to the image resizing engine */
  imgParams: object,

  /** The hostname of the image CDN. This comes automatically from redux store, <em>config["cdn-image"]</em> */
  imageCDN: string,

  /** The Image CDN Format. This comes automatically from redux store, <em>config["image-cdn-format"]</em> (default: <em>"thumbor"</em>) */
  imageCDNFormat: string
};

/**
 * This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.
 *
 * See the tutorial {@tutorial using-responsive-image} for an in depth look at using this component
 *
 * Example
 * ```javascript
 * import { ResponsiveImage } from '@quintype/components';
 *
 * <figure className="story-grid-item-image qt-image-16x9">
 *   <ResponsiveImage slug={props.story["hero-image-s3-key"]}
 *     metadata={props.story["hero-image-metadata"]}
 *     alt={props.story['headline']}
 *     aspectRatio={[16,9]}
 *     defaultWidth={480} widths={[250,480,640]}
 *     sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *     imgParams={{auto:['format', 'compress']}}/>
 * </figure>
 * ```
 * @component
 * @category Images
 * @tutorial using-responsive-image
 */
export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);
