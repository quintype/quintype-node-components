import omit from "@babel/runtime/helpers/objectWithoutProperties";
import emptyWebGif from "empty-web-gif";
import { FocusedImage } from "quintype-js";
import React, { useEffect } from "react";
import { hashString, USED_PARAMS } from "./image-utils";

let forceLoadingGumlet = false;
function loadGumlet() {
  if (window.GUMLET_CONFIG || window.gumlet || forceLoadingGumlet === true) {
    return;
  }
  if (process.env.NODE_ENV == "development") {
    console.warn(
      "Loading Gumlet Dynamically! This is really bad for page speed. Please see https://developers.quintype.com/malibu/tutorial/gumlet-integration"
    );
  }
  forceLoadingGumlet = true;
  window.GUMLET_CONFIG = window.GUMLET_CONFIG || {
    hosts: [],
  };
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.gumlet.com/gumlet.js/2.0/gumlet.min.js";
  document.body.appendChild(script);
}

export function GumletImage(props) {
  const { slug, metadata, aspectRatio, imageCDN, imgParams, reactTag, className } = props;
  const image = new FocusedImage(slug, metadata);

  function generatePath(size) {
    return "//" + imageCDN + "/" + image.path(aspectRatio, Object.assign({ w: size }, imgParams));
  }

  function generateSizes() {
    // return "(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1240px) 33vw, 11.13vw";
    const sizes = props.widths.map((size) => {
      if (size === 250) {
        return "(max-width: 600px) 250px";
      } else if (size === 480) {
        return "(max-width: 900px) 480px";
      }
      return "640px";
    });
    return sizes.join(",");
  }

  const imageProps = {
    src: emptyWebGif,
    "data-src": "https://" + imageCDN + "/" + image.path(aspectRatio, imgParams),
    srcSet: props.widths ? props.widths.map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    sizes: generateSizes(),
    key: hashString(slug),
  };

  const Tag = reactTag || "img";

  useEffect(loadGumlet);

  return (
    <React.Fragment>
      <Tag {...imageProps} {...omit(props, USED_PARAMS)} className={className ? `qt-image ${className}` : "qt-image"} />
      <noscript>
        <img src={`https://${imageCDN}/${image.path(aspectRatio, { ...imgParams, w: 1200 })}`} alt={props.alt || ""} />
      </noscript>
    </React.Fragment>
  );
}
