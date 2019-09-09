import React from "react";
import {connect} from "react-redux";
import {FocusedImage} from "quintype-js";
import {func, string, arrayOf, number, object} from 'prop-types';
import emptyWebGif from 'empty-web-gif';
import omit from '@babel/runtime/helpers/objectWithoutProperties';
import { objectExpression } from "@babel/types";

const USED_PARAMS = ["imageCDN","defaultWidth","widths","imgParams","slug","metadata","aspectRatio", "reactTag", "eager"];

// Add the following CSS somewhere: img.qt-image { width: 100%; object-fit: cover; }

function hashString(string) {
  if(!string)
    return 0;

  var hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    hash  = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);

  function generatePath(size) {
    return "//" + props.imageCDN + "/" + image.path(props.aspectRatio, Object.assign({w: size}, props.imgParams));
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ?  props.widths.map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

class ResponsiveImageBase extends React.Component {
  constructor(props, context) {
    if(process.env.NODE_ENV == 'development' && !props.alt && !props.reactTag) {
      global.console && global.console.warn(`Image Found without an alt attribute: ${responsiveProps(props).src}`);
    }

    super(props, context);
    this.state = {
      showImage: !this.shouldLazyLoad()
    }
  }

  shouldLazyLoad() {
    if (this.props.eager === true) {
      return false;
    }
    if (this.context.lazyLoadEagerPredicate && this.context.lazyLoadEagerPredicate(this.props.eager)) {
      return false;
    }
    if (this.context.lazyLoadObserveImage && this.context.lazyLoadUnobserveImage) {
      return true;
    }
    return false;
  }

  render() {
    const imageProps = this.state.showImage ? responsiveProps(this.props) : {src: emptyWebGif};
    return React.createElement(this.props.reactTag || "img", Object.assign(imageProps, omit(this.props, USED_PARAMS), {
      ref: dom => this.dom = dom,
      className: this.props.className ? `qt-image ${this.props.className}` : 'qt-image'
    }));
  }

  componentDidMount() {
    this.shouldLazyLoad() && this.context.lazyLoadObserveImage(this.dom, this);
  }

  componentWillUnmount() {
    this.shouldLazyLoad() && this.context.lazyLoadUnobserveImage(this.dom, this);
  }

  showImage() {
    this.setState({showImage: true});
  }
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

ResponsiveImageBase.contextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func,
  lazyLoadEagerPredicate: func
}

ResponsiveImageBase.propTypes = {
  /** The Path to the image, relative to images.assettype.com. Usually /publisher/yyyy/mm/<rand>/image-name.type */
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
  imgParams: object
}

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
