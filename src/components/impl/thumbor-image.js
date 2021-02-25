import React from "react";
import emptyWebGif from 'empty-web-gif';
import omit from '@babel/runtime/helpers/objectWithoutProperties';
import { func } from 'prop-types';
import { FocusedImage } from "quintype-js";
import { USED_PARAMS, hashString } from './image-utils';

export function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);

  function generatePath(size) {
    return "//" + props.imageCDN + "/" + image.path(props.aspectRatio, Object.assign({ w: size }, props.imgParams));
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ? props.widths.map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

export class ThumborImage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showImage: !this.shouldLazyLoad()
    };
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
    const imageProps = this.state.showImage ? responsiveProps(this.props) : { src: emptyWebGif };
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
    this.setState({ showImage: true });
  }
}

ThumborImage.contextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func,
  lazyLoadEagerPredicate: func
}
