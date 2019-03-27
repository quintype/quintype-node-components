import React from "react";
import {connect} from "react-redux";
import {withError} from './with-error';

function getNativeShareHandler(canNativeShare, title, fullUrl) {   
  if (!canNativeShare) {
    return null;
  }

  return function handleShare() {
    window.navigator.share({
      title: title,
      url: fullUrl,
    }).catch(console.error);
  }
}

class SocialShareBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canNativeShare: false
    }
  }

  componentDidMount() {
    this.setState({canNativeShare: global && global.navigator && global.navigator.share})
  }

  render() {
    const fullUrl = `${this.props.publisherUrl}/${this.props.url}`;
    const hashtags = this.props.hashtags ? this.props.hashtags : '';

    return React.createElement(this.props.template, Object.assign({
      fbUrl: `https://www.facebook.com/sharer.php?u=${fullUrl}`,
      twitterUrl: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${this.props.title}&hashtags=${hashtags}`,
      gplusUrl: `https://plus.google.com/share?url=${fullUrl}`,
      linkedinUrl: `https://www.linkedin.com/shareArticle?url=${fullUrl}&title=${this.props.title}`,
      whatsappUrl: `https://api.whatsapp.com/send?text=${fullUrl}`,
      mailtoUrl: `mailto:${''}?subject=${this.props.title}&body=${fullUrl}`,
      handleNativeShare: getNativeShareHandler(this.state.canNativeShare, this.props.title, fullUrl)
    }, this.props));
  }
}

function mapStateToProps(state) {
  return {
    publisherUrl: state.qt.config["sketches-host"]
  };
}

export const SocialShare = connect(mapStateToProps, {})(withError(SocialShareBase));
