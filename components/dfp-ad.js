import React from 'react';
import {AdSlot, DFPSlotsProvider} from 'react-dfp';
import {connect} from 'react-redux';
import {withError} from './with-error';

function DfpAdBase({defaultNetworkID, config, collapseEmptyDivs, targetingArguments, adtype}) {
  const adConfig = config[adtype];
  return <DFPSlotsProvider dfpNetworkId={defaultNetworkID}
                           collapseEmptyDivs={collapseEmptyDivs}
                           targetingArguments={targetingArguments}
                           sizeMapping={adConfig.viewPortSizeMapping}>
    <AdSlot {...adConfig} />
  </DFPSlotsProvider>;
}

export function createDfpAdComponent({defaultNetworkID, config, targeting, collapseEmptyDivs = true}) {
  return connect((state) => ({
    targetingArguments: targeting(state),
    defaultNetworkID: defaultNetworkID,
    config: config,
    collapseEmptyDivs: collapseEmptyDivs
  }), () => ({}))(withError(DfpAdBase));
}
