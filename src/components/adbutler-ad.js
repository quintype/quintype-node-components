import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";

function getSize(sizeMap) {
  const canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement);
  const screenWidth = canUseDOM && get(window, ["screen", "width"], 440);

  if(!screenWidth) return [];
  if (screenWidth < 441) return sizeMap["mobile"];
  if (screenWidth < 992) return sizeMap["tablet"];
  return sizeMap["desktop"];
}

export function AdbutlerAd({ adtype, adbutlerConfig, sizes }) {
  const { publisherId = "", [adtype]: zoneId = "" } = adbutlerConfig;
  const { [adtype]: sizeMap } = sizes;
  const size = getSize(sizeMap);
  const [ width = 0, height = 0 ] = size;
  const src = `https://servedbyadbutler.com/adserve/;ID=${publisherId};size=${width}x${height};setID=${zoneId};type=iframe;click=CLICK_MACRO_PLACEHOLDER`;
  const hasSize = size.length;

  return (
    <div className="adbutler-wrapper">
      { hasSize ? <iframe
        src={src}
        width={width}
        height={height}
        marginWidth="0"
        marginHeight="0"
        hspace="0"
        vspace="0"
        frameBorder="0"
        scrolling="no"
      /> : null }
    </div>
  );
}

AdbutlerAd.propTypes = {
  adtype: PropTypes.string,
  adbutlerConfig: PropTypes.object,
  sizes: PropTypes.object
};
