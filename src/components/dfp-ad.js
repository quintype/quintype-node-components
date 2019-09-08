import React from 'react';
import {AdSlot, DFPSlotsProvider, DFPManager} from 'react-dfp';
import {connect} from 'react-redux';
import {withError} from './with-error';


/**
 * This is a function which can be used to manage ad units in a single place. A component must be created, and used with the `adtype` parameter. These ads are lazy-loaded and single-request mode is disabled by default which can be overwritten as follows.
 *
 * Example
 * ```javascript
 * import { createDfpAdComponent } from '@quintype/components';
 *
 * export const CONFIG = {
 *   "homepage-2": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
 *   "homepage-3": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
 * }
 *
 * export const DfpAd = createDfpAdComponent({
 *   defaultNetworkID: "123456789",
 *   config: CONFIG,
 *   targeting: function(state) {
 *     const params = {};
 *
 *     // if(storyIsSponsored) params['sponsor'] = storySponsor
 *
 *     return params;
 *   },
 *   // Only if you want to overwrite the existing values
 *   lazyLoad: false,
 *   singleRequest: true
 * });
 *
 * <DfpAd adtype="homepage-2" />
 * ```
 * @param {Object} params
 * @param {string} params.defaultNetworkID - Network Id of the Ad Provider
 * @param {Object} params.config - Configuration of the ads (see example)
 * @param {function} params.targeting - Function which takes in the current state, and returns targetting parameters
 * @param {boolean} params.collapseEmptyDivs (default true)
 * @param {boolean} params.lazyLoad (default true)
 * @param {boolean} params.singleRequest - Run Dfp in Single Request Mode (default false)
 * @category Ads
 * @returns {Component} A component that can
 */
export function createDfpAdComponent({ defaultNetworkID, config, targeting, collapseEmptyDivs = true, lazyLoad = true, singleRequest = false }) {
  return connect((state) => ({
    targetingArguments: targeting(state),
    defaultNetworkID: defaultNetworkID,
    config: config,
    collapseEmptyDivs: collapseEmptyDivs,
    lazyLoad: lazyLoad,
    singleRequest: singleRequest
  }), () => ({}))(withError(DfpAdBase));
}

function DfpAdBase({defaultNetworkID, config, collapseEmptyDivs, targetingArguments, adtype, lazyLoad, singleRequest}) {
  const adConfig = config[adtype];
  return <DFPSlotsProvider dfpNetworkId={defaultNetworkID}
                           collapseEmptyDivs={collapseEmptyDivs}
                           targetingArguments={targetingArguments}
                           sizeMapping={adConfig.viewPortSizeMapping}
                           lazyLoad={lazyLoad}
                           singleRequest={singleRequest}>
    <AdSlot {...adConfig} />
  </DFPSlotsProvider>;
}

export function refreshDfpAds(adSlots) {
  DFPManager.refresh(adSlots);
}
