import React from "react";
import emptyWebGif from 'empty-web-gif';
import { FocusedImage } from "quintype-js";
import { hashString, USED_PARAMS } from "./image-utils";
import omit from '@babel/runtime/helpers/objectWithoutProperties';

export function GumletImage(props) {
  const { slug, metadata, aspectRatio, imageCDN, imgParams, reactTag, className } = props;
  const image = new FocusedImage(slug, metadata);

  const imageProps = {
    src: emptyWebGif,
    "data-src": "https://" + imageCDN + "/" + image.path(aspectRatio, imgParams),
    key: hashString(slug)
  }

  const Tag = reactTag || "img";

  return <React.Fragment>
    <Tag {...imageProps} {...omit(props, USED_PARAMS)} className={className ? `qt-image ${className}` : 'qt-image'} />
    <noscript>
      <Tag src={`https://${imageCDN}/${image.path(aspectRatio, {...imgParams, w: 1200})}`} {...omit(props, USED_PARAMS)} />
    </noscript>
  </React.Fragment>
}
