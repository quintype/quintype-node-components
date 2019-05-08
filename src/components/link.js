import React from "react";
import {connect} from "react-redux";

function preventDefault(e) {
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
  preventDefault = preventDefault,
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

export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkBase);
