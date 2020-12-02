import React from "react";
import {connect} from "react-redux";
import {LinkBase} from "./link-base";


const mapStateToProps = state => ({
    currentHostUrl: state.qt && state.qt.currentHostUrl
});

const mapDispatchToProps = dispatch => ({
    navigateToImpl: function(url) {
      global.app.navigateToPage(dispatch, url);
    }
});

/**
 * This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)
 *
 * ```javascript
 * import { Link } from '@quintype/components';
 * <Link href="/section/story-slug" otherLinkAttribute="value">Text here</Link>
 * ```
 * @category Other
 * @component
 */
export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkBase);
