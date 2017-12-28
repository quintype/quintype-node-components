import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

function LinkBase(props) {
  return React.createElement("a", _(props)
    .omit("navigateTo")
    .merge({onClick: (e) => {
      if(global.disableAjaxLinks)
        return;

      if(e.ctrlKey || e.metaKey || e.shiftKey)
        return;

      e.preventDefault();
      e.stopPropagation();
      props.navigateTo(props.href)
    }})
    .value()
  );
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
