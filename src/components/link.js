import React from "react";
import {connect} from "react-redux";
import { string, func, bool } from 'prop-types';

function preventDefaultImpl(e) {
  e.preventDefault();
  e.stopPropagation();
}

function LinkBase({
  navigateToImpl,
  externalLink,
  callback,
  href,
  currentHostUrl,
  navigateTo = navigateToImpl,
  preventDefault = preventDefaultImpl,
  disableAjaxLinks = global.disableAjaxLinks || global.disableAjaxNavigation,
  ...otherProps
}) {
  return React.createElement("a", Object.assign(otherProps, {
    href,
    onClick(e) {
      if (disableAjaxLinks || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }

      const relativeLink = href.startsWith(currentHostUrl) ? href.replace(currentHostUrl, "") : href;

      if (!relativeLink.startsWith("/")) {
        return;
      }

      preventDefault(e);

      if(externalLink) {
        global.open(externalLink, "_blank");
      } else {
        navigateTo(relativeLink);
      }

      typeof callback === 'function' && callback(e);
    }
  }));
}

LinkBase.propTypes = {
  href: string.isRequired,
  externalLink: bool,
  callback: func,
  /** @private */
  navigateTo: func,
  /** @private */
  preventDefault: func,
  /** @private */
  disableAjaxLinks: bool,
}

function mapStateToProps(state) {
  return {
    currentHostUrl: state.qt && state.qt.currentHostUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToImpl: function(url) {
      global.app.navigateToPage(dispatch, url);
    }
  };
}

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
