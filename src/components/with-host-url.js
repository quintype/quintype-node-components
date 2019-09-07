import { connect } from "react-redux";
import PropTypes from "prop-types";

function WithHostUrlBase({ children, primaryHostUrl, currentHostUrl }) {
  return children({primaryHostUrl, currentHostUrl});
}

WithHostUrlBase.propTypes = {
  children: PropTypes.func.isRequired,
  primaryHostUrl: PropTypes.string,
  currentHostUrl: PropTypes.string,
};

function mapStateToProps({qt = {}}) {
  return {
    primaryHostUrl: qt.primaryHostUrl,
    currentHostUrl: qt.currentHostUrl,
  }
}

function mapDispatchToProps(dispatch) {
  return { };
}

/**
 * This component can be used to get access to the `currentHostUrl` and `primaryHostUrl`, as configured within the editor.
 *
 * Example
 * ```javascript
 * import { WithHostUrl } from '@quintype/components';
 *
 * <WithHostUrl>{({ primaryHostUrl, currentHostUrl }) =>
 *   <div>
 *     <div>primaryHostUrl: {primaryHostUrl}</div>
 *     <div>currentHostUrl: {currentHostUrl}</div>
 *   </div>
 * }</WithHostUrl>
 * ```
 * @component
 * @category Other
 */
export const WithHostUrl = connect(mapStateToProps, mapDispatchToProps)(WithHostUrlBase);
