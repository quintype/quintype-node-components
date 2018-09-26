import React from "react";
import {connect} from "react-redux";
import omit from "lodash/omit";

function LinkBase(props) {
  return React.createElement("a", Object.assign(omit(props, "navigateTo"), {
    onClick(e) {
      if(global.disableAjaxLinks)
        return;

      if(e.ctrlKey || e.metaKey || e.shiftKey)
        return;

      e.preventDefault();
      e.stopPropagation();

      if(props.externalLink) {
        global.open(props.externalLink, "_blank");
      }
      else {
        props.navigateTo(props.href);
      }
    }
  }));
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateTo: function(url) {
      global.app.navigateToPage(dispatch, url);
    }
  };
}

export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkBase);
