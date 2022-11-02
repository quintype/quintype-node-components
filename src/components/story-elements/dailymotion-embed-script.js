import React from "react";
import { WithLazy } from "../with-lazy";

class DailyMotion extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      showVideo: false,
    };
  }

  componentDidMount() {
    if (!this.props.loadIframeOnClick) {
      this.addScript();
    }
  }

  renderVideo = () => {
    this.setState({ showVideo: true }, () => {
      this.addScript();
    });
  };

  addScript = () => {
    const { "video-id": videoId, "player-id": playerId } = this.props.element.metadata;
    const script = document.createElement("script");
    script.src = `https://geo.dailymotion.com/player/${playerId}.js`;
    script.dataset.video = videoId;
    this.containerRef.current.appendChild(script);
  };

  render() {
    const videoId = this.props.element.metadata["video-id"];
    if (this.props.loadIframeOnClick) {
      return (
        <>
          {!this.state.showVideo && (
            <div className="thumbnail-wrapper">
              <button className="dailymotion-playBtn" onClick={this.renderVideo} aria-label="Play Video" />
              <img
                className="dailymotion-thumbnail"
                onClick={this.renderVideo}
                src={`https://www.dailymotion.com/thumbnail/video/${videoId}`}
                alt="daily-motion-video"
              />
            </div>
          )}
          {this.state.showVideo && <div className="dailymotion-embed-wrapper" ref={this.containerRef} />}
        </>
      );
    } else if (!this.props.loadIframeOnClick) {
      return <div className="dailymotion-embed-wrapper" ref={this.containerRef} />;
    }
  }
}

export default function DailyMotionEmbedScript(props) {
  return <WithLazy margin="0px">{() => <DailyMotion {...props} />}</WithLazy>;
}
