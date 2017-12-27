import React from "react";
import {connect} from "react-redux";

function SocialShareBase(props) {
  const fullUrl = `${props.publisherUrl}/${props.url}`;
  const slicedTitle = props.title.length > 60 ? props.title.substr(0, 57) + '...' : props.title;

  return React.createElement(props.template, Object.assign({
    fbUrl: `https://www.facebook.com/sharer.php?u=${fullUrl}`,
    twitterUrl: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${slicedTitle}&hashtags=${props.hashtags}`,
    gplusUrl: `https://plus.google.com/share?url=${fullUrl}`,
    linkedinUrl: `https://www.linkedin.com/shareArticle?url=${fullUrl}&title=${props.title}`
  }, props));
}


function mapStateToProps(state) {
  return {
    publisherUrl: state.qt.config["sketches-host"]
  };
}


export const SocialShare = connect(mapStateToProps, {})(SocialShareBase);
