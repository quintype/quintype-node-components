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
  navigateTo = navigateToImpl,
  preventDefault = preventDefault,
  disableAjaxLinks = global.disableAjaxLinks || global.disableAjaxNavigation,
  ...otherProps
}) {
  return React.createElement("a", Object.assign(otherProps, {
    onClick(e) {
      if(disableAjaxLinks)
        return;

      if(e.ctrlKey || e.metaKey || e.shiftKey)
        return;

      preventDefault(e);

      if(externalLink) {
        global.open(externalLink, "_blank");
      } else {
        navigateTo(href);
      }

      typeof callback === 'function' && callback(e);
    }
  }));
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToImpl: function(url) {
      global.app.navigateToPage(dispatch, url);
    }
  };
}

export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkBase);
