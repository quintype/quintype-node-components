import omit from '@babel/runtime/helpers/objectWithoutProperties';
import emptyWebGif from 'empty-web-gif';
import { func } from 'prop-types';
import { FocusedImage } from 'quintype-js';
import React from 'react';
import { Helmet } from 'react-helmet';
import { USED_PARAMS, hashString } from './image-utils';

export function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);
  const { priority = false } = props;

  function generatePath(size) {
    return '//' + props.imageCDN + '/' + image.path(props.aspectRatio, Object.assign({ w: size }, props.imgParams));
  }

  const resolvePath = (size) => (props.shouldDecodeImage ? decodeURIComponent(generatePath(size)) : generatePath(size));

  const imageProps = {
    src: resolvePath(props.defaultWidth),
    srcSet: props.widths ? props.widths.map((size) => `${resolvePath(size)} ${size}w`).join(',') : undefined,
    key: hashString(props.slug),
    sizes: props?.sizes
  };

  if (priority) {
    return {
      ...imageProps,
      fetchPriority: 'high'
    };
  }
  return {
    ...imageProps
  };
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
    return (
      <>
        {this.props?.priority && (
          <Helmet>
            <link rel="preload" as="image" imagesrcset={imageProps?.srcSet} imagesizes={imageProps?.sizes} />
          </Helmet>
        )}
        {React.createElement(
          this.props.reactTag || 'img',
          Object.assign(imageProps, omit(this.props, USED_PARAMS), {
            ref: (dom) => (this.dom = dom),
            className: this.props.className ? `qt-image ${this.props.className}` : 'qt-image'
          })
        )}
      </>
    );
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
};
