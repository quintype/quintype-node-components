import omit from '@babel/runtime/helpers/objectWithoutProperties';
import emptyWebGif from 'empty-web-gif';
import { FocusedImage } from 'quintype-js';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { LazyLoadImagesContext } from '../lazy-load-images';
import { EagerLoadImagesContext } from '../eager-load-images';
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

export function ThumborImage(props) {
  const lazyLoadContext = useContext(LazyLoadImagesContext);
  const eagerLoadContext = useContext(EagerLoadImagesContext);

  const shouldLazyLoad = () => {
    if (props.eager === true) {
      return false;
    }
    if (eagerLoadContext.lazyLoadEagerPredicate && eagerLoadContext.lazyLoadEagerPredicate(props.eager)) {
      return false;
    }
    if (lazyLoadContext.lazyLoadObserveImage && lazyLoadContext.lazyLoadUnobserveImage) {
      return true;
    }
    return false;
  };

  const [showImage, setShowImage] = useState(() => !shouldLazyLoad());
  const domRef = useRef(null);
  const componentRef = useRef({
    showImage: () => setShowImage(true)
  });

  useEffect(() => {
    const lazyLoad = shouldLazyLoad();
    if (lazyLoad && lazyLoadContext.lazyLoadObserveImage && domRef.current) {
      lazyLoadContext.lazyLoadObserveImage(domRef.current, componentRef.current);
    }

    return () => {
      if (lazyLoad && lazyLoadContext.lazyLoadUnobserveImage && domRef.current) {
        lazyLoadContext.lazyLoadUnobserveImage(domRef.current, componentRef.current);
      }
    };
  }, [props.eager, lazyLoadContext.lazyLoadObserveImage, lazyLoadContext.lazyLoadUnobserveImage, eagerLoadContext.lazyLoadEagerPredicate]);

  const imageProps = showImage ? responsiveProps(props) : { src: emptyWebGif };
  return (
    <>
      {props?.priority && (
        <Helmet>
          <link rel="preload" as="image" imagesrcset={imageProps?.srcSet} imagesizes={imageProps?.sizes} />
        </Helmet>
      )}
      {React.createElement(
        props.reactTag || 'img',
        Object.assign(imageProps, omit(props, USED_PARAMS), {
          ref: domRef,
          className: props.className ? `qt-image ${props.className}` : 'qt-image'
        })
      )}
    </>
  );
}
