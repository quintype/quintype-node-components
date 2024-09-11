import omit from '@babel/runtime/helpers/objectWithoutProperties';
import emptyWebGif from 'empty-web-gif';
import { FocusedImage } from 'quintype-js';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { hashString, USED_PARAMS } from './image-utils';

let forceLoadingGumlet = false;
function loadGumlet() {
  if (window.GUMLET_CONFIG || window.gumlet || forceLoadingGumlet === true) {
    return;
  }
  if (process.env.NODE_ENV == 'development') {
    console.warn(
      'Loading Gumlet Dynamically! This is really bad for page speed. Please see https://developers.quintype.com/malibu/tutorial/gumlet-integration'
    );
  }
  forceLoadingGumlet = true;
  window.GUMLET_CONFIG = window.GUMLET_CONFIG || {
    hosts: []
  };
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.gumlet.com/gumlet.js/2.0/gumlet.min.js';
  document.body.appendChild(script);
}

export function GumletImage(props) {
  const { slug, metadata, aspectRatio, imageCDN, imgParams, reactTag, className, priority, sizes } = props;
  const image = new FocusedImage(slug, metadata);

  const imageProps = {
    src: emptyWebGif,
    'data-src': 'https://' + imageCDN + '/' + image.path(aspectRatio, imgParams),
    key: hashString(slug),
    sizes
  };

  if (priority) {
    imageProps.fetchPriority = 'high';
  }

  const Tag = reactTag || 'img';

  useEffect(loadGumlet);

  const dummyImg =
    'https://qtstage-01.gumlet.io/pbahead%2F2024-03%2F015c38b6-340d-487a-964d-38eb3b9300dc%2Fcb70d9483ca4884a146c4edee29a7b7f.jpg?w=1200&auto=format%2Ccompress&fit=max';

  return (
    <React.Fragment>
      <Helmet>
        <link rel="preload" href={dummyImg} as="image" />
      </Helmet>
      <Tag {...imageProps} {...omit(props, USED_PARAMS)} className={className ? `qt-image ${className}` : 'qt-image'} />
      <noscript>
        <img src={`https://${imageCDN}/${image.path(aspectRatio, { ...imgParams, w: 1200 })}`} alt={props.alt || ''} />
      </noscript>
    </React.Fragment>
  );
}
