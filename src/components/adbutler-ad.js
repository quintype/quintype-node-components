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

/**
 * This component can be used to get ads from `Adbutler` ad service provider based on the `adtype` you want to show
 *
 * Example
 * ```javascript
 * import { AdbutlerAd } from '@quintype/components';
 *
 * // Lists publisher id and the respective mapping of the zone ids
 * const adbutlerConfig = {
 *   publisherId: "175635",
 *   "Horizontal-Ad": "353618",
 *   "Vertical-Ad": "353620"
 * };
 *
 * // Lists sizes of respective ads
 * const sizes = {
 *   "Horizontal-Ad": {
 *     mobile: [320, 50],  // [<width>, <height>]
 *     tablet: [728, 90],
 *     desktop: [728, 90]
 *   },
 *   "Vertical-Ad": {
 *     mobile: [300, 250],
 *     tablet: [300, 600],
 *     desktop: [300, 600]
 *   }
 * };
 *
 * <AdbutlerAd adtype="Story-Middle-Ad" adbutlerConfig={adbutlerConfig} sizes={sizes} />
 * ```
 * @component
 * @category Ads
 */
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
