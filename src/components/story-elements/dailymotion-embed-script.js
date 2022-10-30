import atob from "atob";
import React from "react";
import { WithLazy } from "../with-lazy";


class DailyMotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false
    };
  }

  renderVideo = () => {
    this.setState({ showVideo: true });
  };

  dailymotionIframe=() => {
    return (<div className="dailymotion-iframe-wrapper">{atob(this.props.element["embed-js"])}</div>)

  }



  render() {
    const videoId = this.props.element.metadata["video-id"]
    if (this.props.loadIframeOnClick) {
      return (
        <div className="thumbnail-wrapper">
          {!this.state.showVideo && (
            <>
              <button className="dailymotion-playBtn" onClick={this.renderVideo} aria-label="Play Video" />
              <img
                className="dailymotion-thumbnail"
                onClick={this.renderVideo}
                src={`https://www.dailymotion.com/thumbnail/video/${videoId}`}
                alt="daily-motion-video"
              />
            </>
          )}
          {this.state.showVideo  && (
            dailymotionIframe()
          )}
        </div>
      );

  } else if (!this.props.loadIframeOnClick) {
    return  <>{dailymotionIframe()}</>

}
  }

}


export default function DailyMotionEmbedScript(props) {
  return <WithLazy margin="0px">{() => <DailyMotion {...props} />}</WithLazy>;
};


