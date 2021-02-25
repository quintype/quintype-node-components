import React from "react";
import {connect} from "react-redux";

function LoadingIndicatorBase(props) {
  return <div className={`loading-indicator ${props.loading ? 'loading-indicator-loading' : ''}`}>
    {props.loading && props.children}
  </div>
}

function mapStateToProps(state) {
  return {
    loading: state.pageLoading
  };
}

function mapDispatchToProps() {
  return {};
}

/**
 * This component renders it's children when the app is moving between pages. It can be used to show a spinner. It always has the class "loading-indicator", and also "loading-indicator-loading" when loading.
 *
 * Example
 * ```javascript
 * import { LoadingIndicator } from '@quintype/components';
 *
 * <LoadingIndicator>
 *   <div className="spinner">Please Wait</div>
 * </LoadingIndicator>
 * ```
 * @component
 * @category Other
 */
export const LoadingIndicator = connect(mapStateToProps, mapDispatchToProps)(LoadingIndicatorBase);
