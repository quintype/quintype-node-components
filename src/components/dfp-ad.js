import React from 'react';
import {AdSlot, DFPSlotsProvider, DFPManager} from 'react-dfp';
import {connect} from 'react-redux';
import {withError} from './with-error';

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

export function createDfpAdComponent({defaultNetworkID, config, targeting, collapseEmptyDivs = true, lazyLoad = true, singleRequest = false}) {
  return connect((state) => ({
    targetingArguments: targeting(state),
    defaultNetworkID: defaultNetworkID,
    config: config,
    collapseEmptyDivs: collapseEmptyDivs,
    lazyLoad: lazyLoad,
    singleRequest: singleRequest
  }), () => ({}))(withError(DfpAdBase));
}

export function refreshDfpAds(adSlots) {
  DFPManager.refresh(adSlots);
}
